import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import './BingoBoard.css';
import Navbar from '../components/Navbar';
import cartela from './cartela.json';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const BingoBoard = () => {
    const location=useLocation();
    const navigate=useNavigate();
   // const token = localStorage.getItem('accesstoken');
    //console.log("token is ",token);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const token = localStorage.getItem('accesstoken');
        console.log("token is ",token);
    
    
    //console.log(token);
   // const token=Cookies.get('accesstoken');
  
   const isGeneratingRef = useRef(false);
    
    //localStorage.setItem('username',location.state.user);

    //let username= localStorage.getItem('username');

    const [isnavbar,setNavbar]=useState(true);
    const [numberofplayer,setNumberofPlayer]=useState(0);
    const [currentNumber, setCurrentNumber] = useState(0);
    const [username, setUser] = useState(null);
    const [winerAward, setWinerAward] = useState(0);
    
    const lastCalledNumberRef = useRef(null);
  
    const [numberCall, setCalledNumber] = useState(() => {
        const storedNumbers = localStorage.getItem('calledNumbers');
        return storedNumbers ? JSON.parse(storedNumbers) : [];
    });
    const calledNumbersRef = useRef(numberCall);
    const [numberCallLength, setNumberCallLength] = useState(numberCall.length);
    useEffect(() => {
        // Sync the ref with the state
        calledNumbersRef.current = numberCall;
        // Update the length state whenever the numbers change
        setNumberCallLength(numberCall.length);
    }, [numberCall]);
    useEffect(() => {
        const checkToken = async () => {
          const token = await localStorage.getItem('accesstoken');
          
          if (!token) {
            // If there's no token, navigate to the login page
            navigate("/");
          } else {
            try {
              // Make API call to verify user
              const res = await axios.post(`${BACKEND_URL}/useracess`, {}, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              const username = res.data.username;
              setUser(username);  // Assuming you have a state for `setUser`
            } catch (err) {
              console.error("Error:", err);
              alert("Failed to verify user");
            }
          }
        };
    
        checkToken();  // Call the function to check the token and make the API call
      }, [navigate]);    // const [numberCall, setCalledNumber] = useState(calledNumbersRef.current);
   /*  const [numberCall, setCalledNumber] = useState(() => {
        return JSON.parse(localStorage.getItem('calledNumbers')) || [];

    }); */
    //const [isGenerating, setIsGenerating] = useState(false);
    /* const [isGenerating, setIsGenerating] = useState(() => {
        const storedValue = localStorage.getItem('isGenerating');
        return storedValue ? JSON.parse(storedValue) : false; 
    }); */
    const [isGenerating, setIsGenerating] = useState(false);
    const [venderaward,setvenderaward]=useState(0);
    const [gamewinnerboard,setgamewinnerboard]=useState(false);
      const [marked,setmarked]=useState([]);
     // const [language, setLanguage] = useState('am'); // default to English
     const [language, setLanguage] = useState(() => {
        const storedLanguage = localStorage.getItem('language');
        console.log('Initial Language from localStorage:', storedLanguage); // Debugging log
        return storedLanguage || 'am';
    });
      const [selectedOption, setSelectedOption] = useState(8000); 
      const [isOpen, setIsOpen] = useState(false);
      const options = [
        { label: "7 seconds", value: 8000 },
        { label: "8 seconds", value: 9000 },
        { label: "9 seconds", value: 10000},
        { label: "10 seconds", value: 10000 },
    ];
      const interval = selectedOption;
      const [isShuffling, setIsShuffling] = useState(false);
      const [profit,setprofit]=useState(0);
      const audioRef = useRef(null);
      const handleShuffle = () => {
        // Play shuffle voice
      
        const gameshuffile =getshuffle();
        gameshuffile.preload="auto";
        gameshuffile.play();
         //gameshuffile.play();
        // Trigger animation
        setIsShuffling(true);
          console.log("shffule status",isShuffling);
        // Reset animation after 1.5 seconds
        setTimeout(() => {
            setIsShuffling(false);
        }, 15000);
    };
    console.log("calling speed is",interval);
   
      useEffect(() => {
        localStorage.setItem('calledNumbers', JSON.stringify(calledNumbersRef.current));
    
    }, [calledNumbersRef.current]);
    
    useEffect(() => {
        console.log('Language has changed:', language); // Debugging log
        localStorage.setItem('language', language);
    }, [language]);
    useEffect(() => {
        const checkToken = async () => {
          const token = localStorage.getItem('accesstoken');
          
          if (!token) {
            // If there's no token, navigate to the login page
            navigate("/");
          } else {
            try {
              // Make API call to verify user
              console.log("Backend URL:", "https://adeybingo-10.onrender.com");
              const res = await axios.post(`${BACKEND_URL}/useracess`, {}, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              const username = res.data.username;
              setUser(username);  // Assuming you have a state for `setUser`
            } catch (err) {
              console.error("Error:", err);
              alert("Failed to verify user");
            }
          }
        };
    
        checkToken();  // Call the function to check the token and make the API call
      }, [navigate]); 
  
    // Empty dependency array ensures this runs once on component mount
     
    // Holds called numbers
    const shouldGenerate = useRef(true);  // Tracks whether generation should continue
  
    const [winnerboard, setwinnerboard] = useState(false);
    
  
    const [claimcartela, setclaimcartela] = useState(0);
    
    const [winernumber,setWinernumber]=useState(0);
    const [totalcash,setTotalcash]=useState(0);
    const [awardforagent,setawardforagent]=useState(0);
    
    // Get cartelas and stake from location state
    let cartelas = Array.isArray(location.state?.cartelas) ? location.state.cartelas : [];
   // console.log("cartelas length is",cartelas);
    const [cartes, setCartes] = useState(0); 
      const [winstate1, setWinstate] = useState(cartela[cartes]?.cart || []); 
      const [losestate,setlosestate]= useState(cartela[cartes]?.cart || []);
    const stake = location.state?.stake || 0;
    let intialstate=cartela[cartes].cart;
    
   
    const handleStart = () => {
        if (!isGenerating) {
            isGeneratingRef.current = true;  // Stop the number generation
            setIsGenerating(true);  
        }
    };
    const setAmount = (cartelas, stake) => {
        const numberofplayer=cartelas.length;
        const total = cartelas.length;
        const totalcash= stake * total ;
        const final = totalcash * 0.8;
        const award=totalcash*0.2;
        const vendor=award*0.3;
        const awardforagen=award-vendor;
        setNumberofPlayer(numberofplayer);
        setWinerAward(final);
        setprofit(award)
        setvenderaward(vendor);
        setTotalcash(totalcash);
        setawardforagent(awardforagen);
    };
    
// Stop function
const handleStop = () => {
    isGeneratingRef.current = false;  // Stop the number generation
    setIsGenerating(false);  
};
useEffect(() => {
   
    if (isGenerating) {
        
        startRandomNumberGenerator();
    }
}, [isGenerating]);
          
   
    /*  useEffect(() => {
        // Initialize isGenerating only on initial load; reset to false if not in localStorage
        if (localStorage.getItem('isGenerating') === null) {
            setIsGenerating(false);
        }
    }, []); */




    console.log("is genrating is ",isGenerating);
    console.log("user is" ,username);
   
   
    useEffect(() => {
        setWinstate(cartela[cartes]?.cart || []); // Update winstate1 to the selected cart
    }, [cartes]); // This dependency array watches for changes to cartes

    async function submit(e){
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        localStorage.removeItem('calledNumbers');
        setNavbar(true);
        // Reset the state to an empty array
        setCalledNumber([]);
        cartelas.length=0;
        // Update the ref to reflect the cleared state
        calledNumbersRef.current = [];
        setWinerAward(0);
        setgamewinnerboard(false);
        setCurrentNumber(0);
      
    }
    const newgame=()=>{


        localStorage.removeItem('calledNumbers');

                    // Reset the state to an empty array
                    setCalledNumber([]);
                
                    // Update the ref to reflect the cleared state
                    calledNumbersRef.current = [];
                    setWinerAward(0);
                   handleStop();
                    setCurrentNumber(0);
      navigate("/CartelaSelction", { state: { language: language } });
    }
    const amharicAudioFiles = Array.from({ length: 75 }, (_, i) => {
       const audio=new Audio(`/amharicnumbers/${i + 1}.mp3`);
       audio.preload= "auto";
        return audio;
         // Adjust the path if necessary
    });
   
    const handleLanguageChange = (event) => {
        setLanguage(event.target.value); // This updates the state which triggers useEffect
    };
    const handleChange = (event) => {
        let value = parseInt(event.target.value, 10) - 1; // Adjust input for zero-based index
    
        if (!isNaN(value) && cartela[value]) { // Ensure valid index within cartela bounds
            setCartes(value); // Update cartes, which triggers useEffect to update winstate1
        } else {
            console.error("Invalid selection or index out of bounds");
        }
        
        setclaimcartela(value + 1); // Adjust for display if needed
        setWinernumber(value + 1);  // Adjust for display if needed
    };
    const claimNumber = () => {
      const num=cartes+1;
            cheakwin(intialstate,num);
            console.log(intialstate);
            setwinnerboard(false);
            setIsGenerating(false);
        
    };
    const newgamet=()=>{
        if(language=="am"){
       const gamestart=getGameStartedAudi();
       gamestart.preload="auto";
       gamestart.play();
    }
       else{
        let message="Game started";
        const utterance = new SpeechSynthesisUtterance(message);

            window.speechSynthesis.speak(utterance);
       }
       
       
        setTimeout(() => {
            updateplayer();
           
          
           
        }, 2000);
 
    }
    const gameisnot=()=>{
        const aler=getcartelanot();
        aler.play();
        
       

    }
    const getshuffle=()=>{
        const audio =new Audio('/gamestatus/shuffile.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;
    }
    const getGameStartedAudi = () => {
        const audio= new Audio('/gamestatus/gamestarted.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;

    };
    const carts2=winstate1.map((row,index)=>(
        row.map((cell,cellindex)=>(
          <button className="boxes"  key={cellindex} 
          style={{
              backgroundColor:
              marked.includes(cell) ? '#008000': '#00000'
              /* selectedRow === cellindex && selectedCol === index 
                ? bacolor
                : '#00000', */
               /* color:
              selectedRow === cellindex && selectedCol === index && !isclicked 
                ? '#ffffff'
                : '#000000' */
            
          }}
          >{cell}</button>
        
        )
      )))
      
    const addother=()=>{
        setgamewinnerboard(false);
        setwinnerboard(true);
    }
    const  backtogame=()=>{
        setgamewinnerboard(false);
    }
    const bingoclam = () => {
        if(language=="am"){
            const getGamePuse = getGamePusedAudio();
            getGamePuse.play();
            handleStop();
            setwinnerboard(true);
           
            
        }
        else{
        const utterance = new SpeechSynthesisUtterance("Game Pused");
        window.speechSynthesis.speak(utterance);
        handleStop();
        setwinnerboard(true);}
    };

    useEffect(() => {
        if (cartelas.length > 0) {
            localStorage.setItem('cartelas', JSON.stringify(cartelas));
            localStorage.setItem('stake', stake);
        }
    }, [cartelas, stake]);

    /* useEffect(() => {
        if (isGenerating) {
            startRandomNumberGenerator();
        }
        return () => { shouldGenerate.current = false; };
    }, [isGenerating]); */
/* 
    useEffect(()=>{
        if(cartelas.length>=2){
            setTimeout(() => {
                setIsGenerating(true);
            }, 2000);
        }
    },[cartelas]); */
    useEffect(() => {
        setAmount(cartelas, stake);
    }, [cartelas, stake]);
    /* useEffect(() => {
       
    }, []); */
    
    const startGamer = () => {
         if(language=="am"){
            //const started="started"
            const gameStartedAudio = getGameStartedAudio();
              
            gameStartedAudio.play();
          
           setTimeout(() => {
             handleStart();
                  startRandomNumberGenerator();
                  
            }, 2000); // 1-second delay
          
            
        }
        else{
        const utterance = new SpeechSynthesisUtterance("Game Started");
        window.speechSynthesis.speak(utterance);
        setIsGenerating(true);}
    };
    const closeWinboard=()=>{
        setgamewinnerboard(false);
        calledNumbersRef.current=[];
        
    }
    const getcartelanot=()=>{
        const audio= new Audio('/gamestatus/number_is_not.mp3');
        audio.preload = "auto"; // Preload to reduce delay
       return audio;
    }
    const getGameWining=()=>{
        const audio= new Audio('/gamestatus/the_player_win.mp3');
        audio.preload = "auto"; // Preload to reduce delay
       return audio;
    }
    const playerNotwin=()=>{
        const audio= new Audio('/gamestatus/notwin.mp3');
        audio.preload = "auto"; // Preload to reduce delay
       return audio;
    }
    const getGamePusedAudio=()=>{
        const audio=new Audio('/gamestatus/gamepused.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;
    }
    const getGameStartedAudio = () => {
        const audio= new Audio('/gamestatus/gameresume.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;
    };
    async function updateplayer() {
        
        try{

            await axios.post(`${BACKEND_URL}/updateplayer`,{
                username,stake,numberofplayer,profit,awardforagent,totalcash,venderaward,winerAward
            })
            .then(res=>{
                console.log(res.data);
                if(res.data=="exist"){
                    alert("User already exists")
                }
                else if(res.data=="updated"){
                   //alert("apdated");
                   setNavbar(false);
                   setIsGenerating(true);

                   // console.log("updated sucessfully");
                   /*  localStorage.removeItem('calledNumbers');

                    // Reset the state to an empty array
                    setCalledNumber([]);
                
                    // Update the ref to reflect the cleared state
                    calledNumbersRef.current = [];
                    setWinerAward(0);
                    setgamewinnerboard(false);
                    setCurrentNumber(0); */
                }
            })
            .catch(e=>{
                alert("wrong details")
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    }
    const updateCurrentNumber = (rand) => {
        if (rand <= 15) setCurrentNumber(`B ${rand}`);
        else if (rand <= 30) setCurrentNumber(`I ${rand}`);
        else if (rand <= 45) setCurrentNumber(`N ${rand}`);
        else if (rand <= 60) setCurrentNumber(`G ${rand}`);
        else setCurrentNumber(`O ${rand}`);
    };

    const announceNumber = (number) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            let prefix;
                           if(number<=15){
                            if(language==="am"){
                                playAmharicAudioForNumber(number);
                            }
                            else{
                                if (number >= 10) {
                                    // First announcement: "B {number}"
                                    const utterance1 = new SpeechSynthesisUtterance(`B ${number}`);
                                    window.speechSynthesis.speak(utterance1);
                                
                                    // Second announcement: Split and announce digits
                                    const digits = String(number).split(''); // Split the number into individual digits
                                    const utterance2 = new SpeechSynthesisUtterance(`B ${digits.join(' ')}`);
                                    window.speechSynthesis.speak(utterance2);
                                } else {
                                    // For numbers less than 10
                                    const utterance = new SpeechSynthesisUtterance(`B ${number}`);
                                    window.speechSynthesis.speak(utterance);
                                }
                           }}
                          else if(number<=30){
                            
                            if(language==="am"){
                                playAmharicAudioForNumber(number);
                            }
                            else{
                            const utterance = new SpeechSynthesisUtterance(`I ${number}`);
                            utterance.lang = language === "en" ? "en-US" : "am-ET";
                            window.speechSynthesis.speak(utterance);
                            const digits = String(number).split(''); // Split the number into individual digits
                            const utterance2 = new SpeechSynthesisUtterance(`I ${digits.join(' ')}`);
                            utterance2.lang = utterance.lang; 
                            window.speechSynthesis.speak(utterance2);
                        }
                           }
                           else if(number<=45){
                            if(language==="am"){
                                playAmharicAudioForNumber(number);
                            }
                            else{
                            const utterance = new SpeechSynthesisUtterance(`N ${number}`);
                            window.speechSynthesis.speak(utterance);
                            const digits = String(number).split(''); // Split the number into individual digits
                            const utterance2 = new SpeechSynthesisUtterance(`N ${digits.join(' ')}`);
                            window.speechSynthesis.speak(utterance2);
                        }
                           }
                         else if(number<=60){
                          
                            if(language==="am"){
                                playAmharicAudioForNumber(number);
                            }
                            else{
                            const utterance = new SpeechSynthesisUtterance(`G ${number}`);
                            window.speechSynthesis.speak(utterance);
                            const digits = String(number).split(''); // Split the number into individual digits
                            const utterance2 = new SpeechSynthesisUtterance(`G ${digits.join(' ')}`);
                            window.speechSynthesis.speak(utterance2);
                            }
                                                }
                          else{
                          
                            if(language==="am"){
                                playAmharicAudioForNumber(number);
                            }
                            else{
                            const utterance = new SpeechSynthesisUtterance(`O ${number}`);
                            window.speechSynthesis.speak(utterance);                          
                            const digits = String(number).split(''); // Split the number into individual digits
                            const utterance2 = new SpeechSynthesisUtterance(`O ${digits.join(' ')}`);
                            window.speechSynthesis.speak(utterance2);} }
                      
         
            
        }
    };

/*     const startRandomNumberGenerator = async () => {
        shouldGenerate.current = true;

        while (calledNumbersRef.current.length < 75 && shouldGenerate.current) {
            let rand;
            do {
                rand = Math.floor(Math.random() * 75) + 1;
            } while (calledNumbersRef.current.includes(rand));

            calledNumbersRef.current.push(rand); // Adds the new number to the ref array
            announceNumber(rand);
    
            // Update the state so the component re-renders with the new called numbers
            setCalledNumber([...calledNumbersRef.current]);
    
            // Store the updated numbers in localStorage
            localStorage.setItem('calledNumbers', JSON.stringify(calledNumbersRef.current));
    
            updateCurrentNumber(rand)
    
            await new Promise(resolve => setTimeout(resolve, interval)

            //await new Promise(resolve => setTimeout(resolve, interval));
        }
        
        setIsGenerating(false);
    };
 */
    const startRandomNumberGenerator = async () => {
       
        
      //  shouldGenerate.current = true;
      console.log("Starting number generator. isGenerating:", isGeneratingRef.current);

    // Start the number generation loop
    isGeneratingRef.current = true;
     
        //setIsGenerating(true);
        while (calledNumbersRef.current.length < 75 &&  isGeneratingRef.current ) {
          
            if (!isGenerating) {
                console.log("Number generation stopped.");
                return; // Exit the loop
            }
            let rand;
            do {
                rand = Math.floor(Math.random() * 75) + 1;
            } while (calledNumbersRef.current.includes(rand)); // This should work as `current` is an array
    
            calledNumbersRef.current.push(rand); // Adds the new number to the ref array
            lastCalledNumberRef.current=rand;
            console.log("last clled number is",lastCalledNumberRef.current);
            
            announceNumber(rand)
            // Update the state so the component re-renders with the new called numbers
            
            
            // Store the updated numbers in localStorage
            localStorage.setItem('calledNumbers', JSON.stringify(calledNumbersRef.current));
            setCalledNumber([...calledNumbersRef.current]);
         
            updateCurrentNumber(rand);
    
            await new Promise(resolve => setTimeout(resolve, interval));
        
    }
    
        setIsGenerating(false);
    };
    
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    const toggleDropdown = () => setIsOpen(!isOpen);
    
    
    const playAmharicAudioForNumber = (number) => {
        if (number >= 1 && number <= 75) {
           try { const audio=amharicAudioFiles[number - 1].play();
            audio.preload = "auto"; // Preload each number audio
            return audio; // Play audio for the specific number}
            }
            catch (err) {
            console.error('Error playing audio:', err);
        }
        } 
        else {
            console.error('Number out of range');
        }
    };
    const cheakwin = async (initialState, num) => {
        const calledNumbers = calledNumbersRef.current;
        const lastCalledNumber = lastCalledNumberRef.current;
    
        if (!cartelas.includes(num)) {
            if (language == "am") {
                gameisnot();
            } else {
                const utterance = new SpeechSynthesisUtterance("the number is not in the list");
                window.speechSynthesis.speak(utterance);
            }
        } else {
            // Check rows
            for (let i = 0; i < 5; i++) {
                if (initialState[i].every((num) => calledNumbers.includes(num) || num === '*')) {
                    // Check if the last called number is in this row
                    if (initialState[i].includes(lastCalledNumber)) {
                        if (language == "am") {
                            const win = getGameWining();
                            win.play();
                            const marked1 = initialState[i];
                            setmarked(marked1);
                            setgamewinnerboard(true);
                            console.log(marked1);
                        } else {
                            const marked1 = initialState[i];
                            setmarked(marked1);
                            setgamewinnerboard(true);
                            console.log(marked1);
                            const utterance = new SpeechSynthesisUtterance(`cartela number ${num} win`);
                            window.speechSynthesis.speak(utterance);
                        }
                        return;
                    }
                }
            }
    
            // Check columns
            for (let i = 0; i < 5; i++) {
                if (initialState.every((row) => row[i] === '*' || calledNumbers.includes(row[i]))) {
                    // Check if the last called number is in this column
                    if (initialState.some((row) => row[i] === lastCalledNumber)) {
                        if (language == "am") {
                            const win = getGameWining();
                            win.play();
                            const marked1 = initialState.map((row) =>
                                calledNumbers.includes(row[i]) || row[i] === '*' ? row[i] : null
                            );
                            setmarked(marked1);
                            setgamewinnerboard(true);
                            console.log(marked1);
                        } else {
                            const marked1 = initialState.map((row) =>
                                calledNumbers.includes(row[i]) || row[i] === '*' ? row[i] : null
                            );
                            setmarked(marked1);
                            setgamewinnerboard(true);
                            console.log(marked1);
                            const utterance = new SpeechSynthesisUtterance(`cartela number ${num} win`);
                            window.speechSynthesis.speak(utterance);
                        }
                        return;
                    }
                }
            }
    
            // Check diagonals
            const diagonals = [
                [initialState[0][0], initialState[1][1], initialState[2][2], initialState[3][3], initialState[4][4]],
                [initialState[0][4], initialState[1][3], initialState[2][2], initialState[3][1], initialState[4][0]],
            ];
    
            for (let diagonal of diagonals) {
                if (diagonal.every((num) => calledNumbers.includes(num) || num === '*')) {
                    // Check if the last called number is in the diagonal
                    if (diagonal.includes(lastCalledNumber)) {
                        if (language == "am") {
                            const win = getGameWining();
                            win.play();
                            setmarked(diagonal);
                            setgamewinnerboard(true);
                            console.log(diagonal);
                        } else {
                            setmarked(diagonal);
                            setgamewinnerboard(true);
                            console.log(diagonal);
                            const utterance = new SpeechSynthesisUtterance(`cartela number ${num} win`);
                            window.speechSynthesis.speak(utterance);
                        }
                        return;
                    }
                }
            }
    
            // Check corners (if applicable)
            const corners = [
                [initialState[0][0], initialState[0][4], initialState[4][0], initialState[4][4]],
            ];
    
            for (let corner of corners) {
                if (corner.every((num) => calledNumbers.includes(num) || num === '*')) {
                    // Check if the last called number is in the corner
                    if (corner.includes(lastCalledNumber)) {
                        if (language == "am") {
                            const win = getGameWining();
                            win.play();
                            setmarked(corner);
                            setgamewinnerboard(true);
                            console.log(corner);
                        } else {
                            setmarked(corner);
                            setgamewinnerboard(true);
                            console.log(corner);
                            const utterance = new SpeechSynthesisUtterance(`cartela number ${num} win`);
                            window.speechSynthesis.speak(utterance);
                        }
                        return;
                    }
                }
            }
    
            // If no win condition is met, notify player
            const marked1 = initialState
                .flatMap((row) => row.filter((num) => calledNumbers.includes(num) || num === '*'));
            setmarked(marked1);
            setgamewinnerboard(true);
            console.log(marked1);
            if (language == "am") {
                const notwin = playerNotwin();
                notwin.play();
            } else {
                let message = "you click wrong pattern";
                const utterance = new SpeechSynthesisUtterance(message);
                window.speechSynthesis.speak(utterance);
            }
        }
    };
    // Handle win logic
    const handleWin = (markedNumbers) => {
        if (language === "am") {
            const win = getGameWining();
            win.play();
            setmarked(markedNumbers);
            setgamewinnerboard(true);
            console.log(markedNumbers);
        } else {
            setmarked(markedNumbers);
            setgamewinnerboard(true);
            const utterance = new SpeechSynthesisUtterance(`Cartela number ${markedNumbers} win`);
            window.speechSynthesis.speak(utterance);
        }
    };
    
     
    console.log("the token is  apend",token);
    return (
    
        <React.Fragment>
           
           {isnavbar && <Navbar /> }     
           {isnavbar    &&   <div>
            <label htmlFor="language-select">Select Language:</label>
            <select id="language-select" value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="am">Amharic</option>
            </select>
        </div>}
            <div className="mainbody">
                <div className="board-container">
                    <div className="current-number">
                        <div className="inner-circle">
                            <p>{currentNumber}</p>
                        </div>
                    </div>
                    <div className='Colum'>
                        <button>B</button>
                        <button>I</button>
                        <button>N</button>
                        <button>G</button>
                        <button>O</button>
                    </div>
                    <div className="numbers-container">
                        {[...Array(75)].map((_, index) => {
                            const number = index + 1;
                            return (
                                <button 
                                    key={number} 
                                    className="number-button" 
                                    style={{ background: numberCall.includes(number) ? '#eeeeee' : '#040b01f1' ,color:numberCall.includes(number)?'black':'white'}}>
                                    {number}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="playboard">
                    <div className="comandboards">
                    <button className="Leav_button"  disabled={cartelas.length === 0} onClick={newgamet}>Start Game</button>
                        <button className="start_button" disabled={cartelas.length === 0} onClick={startGamer}>Resume</button>
                        <button className="claim_button" disabled={cartelas.length === 0} onClick={bingoclam}>BINGO</button>
                        <button className="Next_button" onClick={newgame}>New Game</button>
                        <button className="Next_shuffle" disabled={cartelas.length >= 1} onClick={handleShuffle}>shuffile</button>
                       
                       </div>
                       {isnavbar && <div className="dropdown-container">
                    <p className="selected-time">Selected time: {selectedOption / 1000} seconds</p>
            <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
                {options.find((option) => option.value === selectedOption)?.label || "Select Time"}
                <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
            </button>

            {isOpen && (
                <ul className="dropdown-menu">
                    {options.map((option) => (
                        <li key={option.value}>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedOption(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            
        </div>}
                  
       {!isnavbar && <div>
        <p className="selected-time1">number of calledNumbers</p>
        <div className="current-number1">
                            <p>{numberCallLength}</p>
                        </div>
                    </div>
                    }
                    <div className="net-pay1">
                        <div className="net-pay2">
                            <p>{winerAward || 'winner'}</p>
                        </div>
                    </div>

                    {winnerboard && (
                        <div className="popup" id="bingoPopup">
                            <div className="popup-content">
                                <div className='claim'>
                                    <p>Enter the Bingo Claimer Number </p>
                                </div>
                                <div className='claiminput'>
                                    <input type='number' onChange={handleChange} />
                                </div>
                                <div className='Cheack'>
                                    <button onClick={claimNumber}>Check</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {gamewinnerboard &&
      <div className="popupw" id="bingoPopup">
      <div className="popup-contentw">
   
          <h3> win by  cartela number {winernumber}</h3>
            
         
          
          <div className="bingoboard2w">
    
    <div className="B">B</div>
   <div className="I">I</div>
   <div className="N">N</div>
   <div className="G">G</div>
   <div className="O">O</div>
   
  </div>
  <div className="playCartela3w">
      
      {carts2}
 
 
  </div>

        <div className="button-containerw">
            
            <button className="closebtn" id="closePopup" onClick={submit}>Close</button>
            <button className="otherbtn" id="closePopup" onClick={addother}>other</button>
            <button className="backbtn" id="closePopup" onClick={backtogame}>back</button>
        </div>
        </div>
    </div>}
  
    {isShuffling && (
                <div className="shuffle-animation">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div key={i} className="bingo-ball">
                            {Math.floor(Math.random() * 100) + 1}
                        </div>
                    ))}
                </div>
            )}
                </div>

            </div>
        </React.Fragment>
    );
};

export default BingoBoard;