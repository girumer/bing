import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import './BingoBoard.css';
import Navbar from '../components/Navbar';
import cartela from './cartela.json';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import confetti from "canvas-confetti";

const BingoBoard = () => {
    const location=useLocation();
    const navigate=useNavigate();
  
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        const token = localStorage.getItem('accesstoken');
       
     
    
  
   const isGeneratingRef = useRef(false);
    
    

    const [isnavbar,setNavbar]=useState(true);
    const [numberofplayer,setNumberofPlayer]=useState(0);
    const currentNumberRef = useRef(null)
    const [currentNumber, setCurrentNumber] = useState(() => {
        return localStorage.getItem('currentNumber') || ''; 
    });
    const [letter,setleter]=useState("-")
    const [username, setUser] = useState(null);
    const [winerAward, setWinerAward] = useState(0);
    const [fireworklun,setfireworklun]=useState(false);
    const lastCalledNumberRef = useRef(null);
    const displayArrayRef = useRef([]);
    const [displayarray, setdisplayarray] = useState(() => {
        const savedDisplayArray = JSON.parse(localStorage.getItem("displayarray"));
        return savedDisplayArray ? savedDisplayArray.slice(-5) : [];
    });
    
  let lastt=lastCalledNumberRef;
    const [numberCall, setCalledNumber] = useState(() => {
        const storedNumbers = localStorage.getItem('calledNumbers');
        return storedNumbers ? JSON.parse(storedNumbers) : [];
    });
    const calledNumbersRef = useRef(numberCall);
    const [numberCallLength, setNumberCallLength] = useState(() => {
        return JSON.parse(localStorage.getItem('numberCallLength')) || 0;
    });
    useEffect(() => {
        displayArrayRef.current = displayarray;
    }, [displayarray]);
    
    useEffect(() => {
        currentNumberRef.current = currentNumber;
    }, [currentNumber]);
    
    useEffect(() => {
        calledNumbersRef.current = numberCall;
        setNumberCallLength(numberCall.length);
    
        // Store the numbers and length in localStorage
        localStorage.setItem('calledNumbers', JSON.stringify(numberCall));
        localStorage.setItem('numberCallLength', JSON.stringify(numberCall.length));
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
    const [gamewinnerboard1,setgamewinnerboard1]=useState(false);
      const [marked,setmarked]=useState([]);
      const [marked1,setmarked1]=useState([]);
     // const [language, setLanguage] = useState('am'); // default to English
     const [language, setLanguage] = useState(() => {
        const storedLanguage = localStorage.getItem('language');
        console.log('Initial Language from localStorage:', storedLanguage); // Debugging log
        return storedLanguage || 'am';
    });
      const [selectedOption, setSelectedOption] = useState(5000); 
      const [countdown, setCountdown] = useState(selectedOption / 1000);
      const [isOpen, setIsOpen] = useState(false);
      const options = [
        { label: "5 seconds", value: 5000 },
        { label: "6 seconds", value: 6000 },
        { label: "7 seconds", value: 7000 },
   
      
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
      const [winstate2, setWinstate2] = useState(cartela[cartes]?.cart || []); 
      const [losestate,setlosestate]= useState(cartela[cartes]?.cart || []);
    const stake = location.state?.stake || 0;
    const gametype=location.state?.selectegametype||1;
    const percent=location.state?.selectedpercent||0.2;
    console.log("percent is",percent);
    console.log("game type is",gametype);
    let intialstate=cartela[cartes].cart;
    const launchFireworks = () => {
        const duration = 5 * 1000; // 5 seconds
        const end = Date.now() + duration;
      
        const frame = () => {
          confetti({
            particleCount: 100,
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin: {
              x: Math.random(),
              y: Math.random() - 0.2, // Slightly above the screen
            },
          });
      
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
      
        frame();
      };
      useEffect(() => {
        if (fireworklun) {
          launchFireworks();
        }
      }, [fireworklun]);
   console.log("winstate",winstate2);
   console.log("Marked1 State:", marked1);
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
        const percentdeduction=1-percent;
        const final = totalcash * percentdeduction;
        const award=totalcash*percent;
        const vendor=totalcash * percent;
        const awardforagen=award-vendor;
        setNumberofPlayer(numberofplayer);
        setWinerAward(final);
        setprofit(award)
        setvenderaward(vendor);
        setTotalcash(totalcash);
        setawardforagent(awardforagen);
    };
    
// Stop function
const handleStop = async () => {
    isGeneratingRef.current = false;
    setIsGenerating(false);  // This doesn't return a Promise, but you could use a timeout if needed
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
        if(gametype===1){
            setWinstate(cartela[cartes]?.cart || []);
        }
        else{
            setWinstate2(cartela[cartes]?.cart || []);
        }
        // Update winstate1 to the selected cart
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
        setgamewinnerboard1(false);
        setfireworklun(false);
      
      
    }
   
    const newgame = async () => {
        try {
            // ✅ Clear localStorage items
            await Promise.all([
                localStorage.removeItem('calledNumbers'),
                localStorage.removeItem('displayarray'),
                localStorage.removeItem('currentNumber'),
                localStorage.removeItem('numberCallLength')
            ]);
    
            // ✅ Clear states and refs
            setCalledNumber([]);  
            calledNumbersRef.current = [];  
            setdisplayarray([]); 
            displayArrayRef.current = [];
            setCurrentNumber("");  
            currentNumberRef.current = "";  
    
            console.log("Game reset successfully!");
    
            // ✅ Ensure the state updates are complete before navigating
            setTimeout(() => {
                navigate("/CartelaSelction", { state: { language: language } });
            }, 100); // Small delay to ensure cleanup is fully applied before navigating
    
        } catch (error) {
            console.error("Error resetting game:", error);
        }
    };
    
    
    const amharicAudioFiles = Array.from({ length: 75 }, (_, i) => {
       const audio=new Audio(`/amharicnumbers/${i + 1}.mp3`);
       audio.preload= "auto";
        return audio;
         // Adjust the path if necessary
    });
    const amharicAudioFilesfemale= Array.from({ length: 75 }, (_, i) => {
        const audio=new Audio(`/amharicfemale/${i + 1}.mp3`);
      //  audio.play().catch(error => console.error("Audio play error:", error));
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
      if(gametype===1){
       
        cheakwin(intialstate,num);
        console.log(intialstate);
        setwinnerboard(false);
        setIsGenerating(false);
      }
        else{
            
            cheakwin1(intialstate,num);
            console.log(intialstate);
            setwinnerboard(false);
            setIsGenerating(false);
        }
    };
    async function newgamet (){
       
       
        //setTimeout(() => {
         await   updateplayer();
           
          
           
       // }, 2000);
        if(language=="am"){
            //const gamestart=getGameStartedAudi();
            //gamestart.preload="auto";
            //gamestart.play();
            setNavbar(false);
            setIsGenerating(true);
            
         }
         else if(language=="amf"){
             //const gamestart=getGameStartedAudif();
             //gamestart.preload="auto";
             //gamestart.play();
             setNavbar(false);
             setIsGenerating(true);
          }
            else{
             //let message="Game started";
             //const utterance = new SpeechSynthesisUtterance(message);
     
               //  window.speechSynthesis.speak(utterance);
               setNavbar(false);
                 setIsGenerating(true);
            }
            
    }
    const gameisnot=()=>{
        const aler=getcartelanot();
        aler.play();
        
       

    }
    const gameisnotf=()=>{
        const aler=getcartelanotf();
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
    const getGameStartedAudif = () => {
        const audio= new Audio('/gamestatusfemale/gamestarted.mp3');
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
    const carts3 = winstate2.map((row, rowIndex) => (
        row.map((cell, cellIndex) => (
            <button
                className="boxes"
                key={`${rowIndex}-${cellIndex}`}
                style={{
                    backgroundColor: marked1.some(([r, c]) => r === rowIndex && c === cellIndex) 
                        ? '#008000' 
                        : '#000000',
                }}
            >
                {cell}
            </button>
        ))
    ));
     // Return null or handle if winstate2 isn't structured correctly


    // Handle case where winstate2 is not a valid 2D array

     
    const addother=()=>{
        setgamewinnerboard(false);
        setgamewinnerboard1(false);
        setwinnerboard(true);
        setfireworklun(false);
    }
    const  backtogame=()=>{
        setgamewinnerboard(false);
        setgamewinnerboard1(false);
        setfireworklun(false);
    }
    const bingoclam = () => {
        if(language=="am"){
            const getGamePuse = getGamePusedAudio();
            getGamePuse.play();
            handleStop();
            setwinnerboard(true);
           
            
        }
       else if(language=="amf"){
            const getGamePuse = getGamePusedAudiof();
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

    useEffect(() => {
        setAmount(cartelas, stake);
    }, [cartelas, stake]);
   
    const startGamer = () => {
         if(language=="am"){
            //const started="started"
            const gameStartedAudio = getGameStartedAudio();
              
            gameStartedAudio.play();
            setNavbar(false);
          // setTimeout(() => {
             handleStart();
                 // startRandomNumberGenerator();
                  
         //   }, 2000); // 1-second delay
          
            
        }
        if(language=="amf"){
            //const started="started"
            const gameStartedAudio = getGameStartedAudiof();
              
            gameStartedAudio.play();
            setNavbar(false);
           setTimeout(() => {
             handleStart();
                  //startRandomNumberGenerator();
                  
            }, 2000); // 1-second delay
          
            
        }
        else{
        const utterance = new SpeechSynthesisUtterance("Game Started");
        window.speechSynthesis.speak(utterance);
        handleStart();
       // setIsGenerating(true);
       }
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
    const getcartelanotf=()=>{
        const audio= new Audio('/gamestatusfemale/number_is_not.mp3');
        audio.preload = "auto"; // Preload to reduce delay
       return audio;
    }
    const getGameWining=()=>{
        const audio= new Audio('/gamestatus/the_player_win.mp3');
        audio.preload = "auto"; // Preload to reduce delay
       return audio;
    }
    const  getGameWiningfeamel=()=>{
        const audio= new Audio('/gamestatusfemale/the_player_win.mp3');
        audio.preload = "auto"; // Preload to reduce delay
       return audio;
    }
    const playerNotwin=()=>{
        const audio= new Audio('/gamestatus/notwin.mp3');
        audio.preload = "auto"; // Preload to reduce delay
       return audio;
    }
    const playerNotwinf=()=>{
        const audio= new Audio('/gamestatusfemale/notwinf.mp3');
        audio.preload = "auto"; // Preload to reduce delay
       return audio;
    }
    const getGamePusedAudio=()=>{
        const audio=new Audio('/gamestatus/gamepused.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;
    }
    const getGamePusedAudiof=()=>{
        const audio=new Audio('/gamestatusfemale/gamepused.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;
    }
    const getGameStartedAudio = () => {
        const audio= new Audio('/gamestatus/gameresume.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;
    };
    const getGameStartedAudiof = () => {
        const audio= new Audio('/gamestatusfemale/gameresume.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;
    };
    async function updateplayer() {
        
        try{

            await axios.post(`${BACKEND_URL}/updateplayer`,{
                username,stake,numberofplayer,profit,awardforagent,totalcash,venderaward,winerAward,percent
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
        let newNumber = '';
    
        if (rand <= 15) newNumber = `B ${rand}`;
        else if (rand <= 30) newNumber = `I ${rand}`;
        else if (rand <= 45) newNumber = `N ${rand}`;
        else if (rand <= 60) newNumber = `G ${rand}`;
        else newNumber = `O ${rand}`;
    
        setCurrentNumber(newNumber);
        currentNumberRef.current = newNumber; // Store in ref
        localStorage.setItem('currentNumber', newNumber); // Persist in localStorage
    };
 
    useEffect(() => {
        const storedNumber = localStorage.getItem('currentNumber');
        if (storedNumber) {
            setCurrentNumber(storedNumber);
            currentNumberRef.current = storedNumber;
        }
    }, []);
   /*  const announceNumber = (number) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            let prefix;
                           if(number<=15){
                            if(language==="am"){
                                playAmharicAudioForNumber(number);
                            }
                            else if(language==="amf"){
                                playAmharicAudioForNumberfemale(number)  
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
                            else if(language==="amf"){
                                playAmharicAudioForNumberfemale(number)  
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
                            else if(language==="amf"){
                                playAmharicAudioForNumberfemale(number)  
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
                            else if(language==="amf"){
                                playAmharicAudioForNumberfemale(number)  
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
                            else if(language==="amf"){
                                playAmharicAudioForNumberfemale(number)  
                            }
                            else{
                            const utterance = new SpeechSynthesisUtterance(`O ${number}`);
                            window.speechSynthesis.speak(utterance);                          
                            const digits = String(number).split(''); // Split the number into individual digits
                            const utterance2 = new SpeechSynthesisUtterance(`O ${digits.join(' ')}`);
                            window.speechSynthesis.speak(utterance2);} }
                      
         
            
        }
    }; */

   /*  const announceNumber = (number) => {
        return new Promise((resolve) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel any ongoing speech
    
            const announceWithDelay = (text, delay = 0) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const utterance = new SpeechSynthesisUtterance(text);
                        utterance.lang = language === "en" ? "en-US" : "am-ET";
                        utterance.onend = resolve; // Resolve the promise when the utterance ends
                        window.speechSynthesis.speak(utterance);
                    }, delay);
                });
            };
    
            const announceDigits = async (prefix, number) => {
                const digits = String(number).split(''); // Split the number into individual digits
                const fullNumberText = `${prefix} ${number}`;
                const digitsText = `${prefix} ${digits.join(' ')}`;
    
                // Announce the full number first
                await announceWithDelay(fullNumberText);
    
                // Announce the digits after a delay (e.g., 1000ms or 1 second)
                await announceWithDelay(digitsText, 1000);
            };
            
            if (number <= 15) {
                if (language === "am") {
                    playAmharicAudioForNumber(number);
                    resolve();
                } else if (language === "amf") {
                    playAmharicAudioForNumberfemale(number);
                    resolve();
                } else {
                    if (number >= 10) {
                        announceDigits("B", number);
                        resolve();
                    } else {
                        announceWithDelay(`B ${number}`);
                        resolve();
                    }
                }
            } else if (number <= 30) {
                if (language === "am") {
                    playAmharicAudioForNumber(number);
                } else if (language === "amf") {
                    playAmharicAudioForNumberfemale(number);
                } else {
                    announceDigits("I", number);
                }
            } else if (number <= 45) {
                if (language === "am") {
                    playAmharicAudioForNumber(number);
                    resolve();
                } else if (language === "amf") {
                    playAmharicAudioForNumberfemale(number);
                    resolve();
                } else {
                    announceDigits("N", number);
                    resolve();
                }
            } else if (number <= 60) {
                if (language === "am") {
                    playAmharicAudioForNumber(number);
                    resolve();
                } else if (language === "amf") {
                    playAmharicAudioForNumberfemale(number);
                    resolve();
                } else {
                    announceDigits("G", number);
                    resolve();
                }
            } else {
                if (language === "am") {
                    playAmharicAudioForNumber(number);
                } else if (language === "amf") {
                    playAmharicAudioForNumberfemale(number);
                    resolve();
                } else {
                    announceDigits("O", number);
                    resolve();
                }
            }
            
        }
    });
    };  */
    
    const announceNumber = (number) => {
        return new Promise((resolve) => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel(); // Cancel any ongoing speech
    
                const announceWithDelay = (text, delay = 0) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            const utterance = new SpeechSynthesisUtterance(text);
                            utterance.lang = language === "en" ? "en-US" : "am-ET";
                            utterance.onend = resolve; // Resolve when the utterance ends
                            window.speechSynthesis.speak(utterance);
                        }, delay);
                    });
                };
    
                const announceDigits = async (prefix, number) => {
                    const digits = String(number).split('');
                    const fullNumberText = `${prefix} ${number}`;
                    const digitsText = `${prefix} ${digits.join(' ')}`;
    
                    await announceWithDelay(fullNumberText);
                    await announceWithDelay(digitsText, 1000);
                };
    
                const playAmharicAudio = (number) => {
                    return new Promise((resolve) => {
                        if (language === "am") {
                            playAmharicAudioForNumber(number);
                        } else if (language === "amf") {
                            playAmharicAudioForNumberfemale(number);
                        }
                        setTimeout(resolve, 2000); // Simulate audio duration
                    });
                };
    
                (async () => {
                    if (number <= 15) {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            if (number >= 10) {
                                await announceDigits("B", number);
                            } else {
                                await announceWithDelay(`B ${number}`);
                            }
                        }
                    } else if (number <= 30) {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            await announceDigits("I", number);
                        }
                    } else if (number <= 45) {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            await announceDigits("N", number);
                        }
                    } else if (number <= 60) {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            await announceDigits("G", number);
                        }
                    } else {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            await announceDigits("O", number);
                        }
                    }
                    resolve(); // Now resolve only after the announcement completes
                })();
            }
        });
    };
    
  
    const startRandomNumberGenerator = async () => {
        console.log("Starting number generator. isGenerating:", isGeneratingRef.current);
        isGeneratingRef.current = true;
    
        while (calledNumbersRef.current.length < 75 && isGeneratingRef.current) {
            if (!isGeneratingRef.current) {
                console.log("Number generation stopped.");
                return; // Exit the loop
            }
    
            let rand;
            do {
                rand = Math.floor(Math.random() * 75) + 1;
            } while (calledNumbersRef.current.includes(rand));
    
            // **✅ Announce FIRST**
            await announceNumber(rand);
    
            // **✅ Update everything AFTER announcement**
            calledNumbersRef.current.push(rand);
            lastCalledNumberRef.current = rand;
            console.log("Last called number is", lastCalledNumberRef.current);
            localStorage.setItem('calledNumbers', JSON.stringify(calledNumbersRef.current));
            setCalledNumber([...calledNumbersRef.current]);
            updateCurrentNumber(rand);
    
            let letter1 = " ";
            if (rand <= 15) letter1 = "B-";
            else if (rand <= 30) letter1 = "I-";
            else if (rand <= 45) letter1 = "N-";
            else if (rand <= 60) letter1 = "G-";
            else letter1 = "O-";
    
            setleter(letter1);
            let rand2 = letter1 + `${rand}`;
            setdisplayarray((prevDisplayArray) => {
                const updatedArray = [...prevDisplayArray];
                if (!updatedArray.includes(rand2)) {
                    updatedArray.push(rand2);
                }
                if (updatedArray.length > 5) {
                    updatedArray.shift();
                }
    
                // ✅ Update ref and localStorage
                displayArrayRef.current = updatedArray;
                localStorage.setItem("displayarray", JSON.stringify(updatedArray));
    
                return updatedArray;
            });
    
    
            // **✅ Countdown AFTER the number is announced**
            
    
            // **✅ Wait before the next number**
            await new Promise(resolve => setTimeout(resolve, selectedOption));
        }
    
        setIsGenerating(false);
    };
    
    
    
    /* const announceNumber = (number) => {
        return new Promise((resolve) => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel(); // Cancel any ongoing speech
    
                const announceWithDelay = (text, delay = 0) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            const utterance = new SpeechSynthesisUtterance(text);
                            utterance.lang = language === "en" ? "en-US" : "am-ET";
                            utterance.onend = resolve; // Resolve the promise when speech ends
                            window.speechSynthesis.speak(utterance);
                        }, delay);
                    });
                };
    
                const announceDigits = async (prefix, number) => {
                    const digits = String(number).split('');
                    const fullNumberText = `${prefix} ${number}`;
                    const digitsText = `${prefix} ${digits.join(' ')}`;
    
                    // Wait for the full number announcement
                    await announceWithDelay(fullNumberText);
    
                    // Wait for the digits announcement
                    await announceWithDelay(digitsText, 1000);
                };
    
                // Handle Amharic audio (must return a promise)
                const playAmharicAudio = (number) => {
                    return new Promise((resolve) => {
                        if (language === "am") {
                            playAmharicAudioForNumber(number);
                        } else if (language === "amf") {
                            playAmharicAudioForNumberfemale(number);
                        }
                        setTimeout(resolve, 2000); // Assume Amharic audio takes 2 seconds
                    });
                };
    
                const processAnnouncement = async () => {
                    if (number <= 15) {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            if (number >= 10) {
                                await announceDigits("B", number);
                            } else {
                                await announceWithDelay(`B ${number}`);
                            }
                        }
                    } else if (number <= 30) {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            await announceDigits("I", number);
                        }
                    } else if (number <= 45) {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            await announceDigits("N", number);
                        }
                    } else if (number <= 60) {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            await announceDigits("G", number);
                        }
                    } else {
                        if (language === "am" || language === "amf") {
                            await playAmharicAudio(number);
                        } else {
                            await announceDigits("O", number);
                        }
                    }
                };
    
                processAnnouncement().then(resolve);
            }
        });
    }; */
    
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
    const playAmharicAudioForNumberfemale = (number) => {
        if (number >= 1 && number <= 75) {
           try { const audio=amharicAudioFilesfemale[number - 1].play();
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
   /*  const cheakwin = async (initialState, num) => {
        const calledNumbers = calledNumbersRef.current;
        //const lastCalledNumber = lastCalledNumberRef.current;
    
        if (!cartelas.includes(num)) {
            if (language == "am") {
                gameisnot();
            }
           else if (language == "amf") {
                gameisnotf();
            }
            else {
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
                            setfireworklun(true);
                            console.log(marked1);
                        } 
                        else if (language == "amf") {
                            const win = getGameWiningfeamel();
                            win.play();
                            const marked1 = initialState[i];
                            setmarked(marked1);
                            setgamewinnerboard(true);
                            setfireworklun(true);
                            console.log(marked1);
                        }
                        else {
                            const marked1 = initialState[i];
                            setmarked(marked1);
                            setgamewinnerboard(true);
                            setfireworklun(true);
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
                const isColumnComplete = intialstate.every((row) => {
                  return row[i] === "*" || calledNumbers.includes(row[i]);
                }); {
                    if(isColumnComplete){
                    // Check if the last called number is in this column
                    if (initialState.some((row) => row[i] === lastCalledNumber)) {
                        if (language == "am") {
                            const win = getGameWining();
                            console.log()
                            win.play();
                            const marked1 = initialState.map((row) =>
                                calledNumbers.includes(row[i]) || row[i] === '*' ? row[i] : null
                            );
                            setmarked(marked1);
                            setfireworklun(true);
                            setgamewinnerboard(true);
                            console.log(marked1);
                        } 
                        else if (language == "amf") {
                            const win = getGameWiningfeamel();
                            win.play();
                            const marked1 = initialState[i];
                            setmarked(marked1);
                            setgamewinnerboard(true);
                            setfireworklun(true);
                            console.log(marked1);
                        }
                        else {
                            const marked1 = initialState.map((row) =>
                                calledNumbers.includes(row[i]) || row[i] === '*' ? row[i] : null
                            );
                            setmarked(marked1);
                            setgamewinnerboard(true);
                            setfireworklun(true);
                           
                            console.log(marked1);
                            const utterance = new SpeechSynthesisUtterance(`cartela number ${num} win`);
                            window.speechSynthesis.speak(utterance);
                        }
                        return;
                    }
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
                            setfireworklun(true);
                            console.log(diagonal);
                        }
                        else if (language == "amf") {
                            const win = getGameWiningfeamel();
                           
                            win.play();
                            setmarked(diagonal);
                            setgamewinnerboard(true);
                            setfireworklun(true);
                            console.log(diagonal);
                        }
                         else {
                            setmarked(diagonal);
                            setgamewinnerboard(true);
                            setfireworklun(true);
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
                            setfireworklun(true);
                            console.log(corner);
                        } 
                        else if (language == "amf") {
                            const win = getGameWiningfeamel();
                            win.play();
                            setmarked(corner);
                            setgamewinnerboard(true);
                            setfireworklun(true);
                            console.log(corner);
                        }
                        else {
                            setmarked(corner);
                            setgamewinnerboard(true);
                            setfireworklun(true);
                            console.log(corner);
                            const utterance = new SpeechSynthesisUtterance(`cartela number ${num} win`);
                            window.speechSynthesis.speak(utterance);
                        }
                        return;
                    }
                }
            } 
                const center=[
            [initialState[1][2], initialState[2][1], initialState[2][3], initialState[3][2]],
        ];
           for (let centerPattern  of center) {
            if (centerPattern.every((num) => calledNumbers.includes(num) || num === '*')) {
                // Check if the last called number is in the corner
                if (centerPattern.includes(lastCalledNumber)) {
                    if (language == "am") {
                        const win = getGameWining();
                        win.play();
                        setmarked(centerPattern );
                        setgamewinnerboard(true);
                        setfireworklun(true);
                        console.log(centerPattern);
                    } 
                    else if (language == "amf") {
                        const win = getGameWiningfeamel();
                        win.play();
                        setmarked(centerPattern );
                        setgamewinnerboard(true);
                        setfireworklun(true);
                        console.log(centerPattern);
                    }
                    else {
                        setmarked(centerPattern);
                        setgamewinnerboard(true);
                        setfireworklun(true);
                        console.log(centerPattern);
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
            if (language === "am") {
                const notwin = playerNotwin();
                notwin.play();
            } 
          else  if (language ==="amf") {
                const notwin = playerNotwinf();
                notwin.play();
            } 
            else {
                let message = "you click wrong pattern";
                const utterance = new SpeechSynthesisUtterance(message);
                window.speechSynthesis.speak(utterance);
            }
        }
    }; */
    const cheakwin = async (initialState, num) => {
        const calledNumbers = calledNumbersRef.current;
        const lastCalledNumber = lastCalledNumberRef.current;
    
        if (!cartelas.includes(num)) {
            if (language == "am") {
                gameisnot();
            } else if (language == "amf") {
                gameisnotf();
            } else {
                const utterance = new SpeechSynthesisUtterance("the number is not in the list");
                window.speechSynthesis.speak(utterance);
            }
        } else {
            // Check rows
            for (let i = 0; i < 5; i++) {
                if (initialState[i].every((num) => calledNumbers.includes(num) || num === '*')) {
                    // Ensure the last called number is part of this row
                    if (initialState[i].includes(lastCalledNumber)) {
                        // Handle win logic for rows
                        handleWinLogic(initialState[i], "row", i);
                        return;
                    }
                }
            }
    
            // Check columns
            for (let i = 0; i < 5; i++) {
                const isColumnComplete = initialState.every((row) => row[i] === "*" || calledNumbers.includes(row[i]));
                if (isColumnComplete) {
                    // Ensure the last called number is part of this column
                    if (initialState.some((row) => row[i] === lastCalledNumber)) {
                        // Handle win logic for columns
                        handleWinLogic(initialState.map((row) => row[i]), "column", i);
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
                    // Ensure the last called number is part of this diagonal
                    if (diagonal.includes(lastCalledNumber)) {
                        // Handle win logic for diagonals
                        handleWinLogic(diagonal, "diagonal");
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
                    // Ensure the last called number is part of this corner
                    if (corner.includes(lastCalledNumber)) {
                        // Handle win logic for corners
                        handleWinLogic(corner, "corner");
                        return;
                    }
                }
            }
    
            // Handle no win scenario
            handleNoWin(initialState, num);
        }
    };
    
    const handleWinLogic = (pattern, type, index) => {
        // Win logic for row, column, diagonal, or corner
        if (language === "am") {
            const win = getGameWining();
            win.play();
            setmarked(pattern);
            setgamewinnerboard(true);
            setfireworklun(true);
            console.log(pattern);
        } else if (language === "amf") {
            const win = getGameWiningfeamel();
            win.play();
            setmarked(pattern);
            setgamewinnerboard(true);
            setfireworklun(true);
            console.log(pattern);
        } else {
            setmarked(pattern);
            setgamewinnerboard(true);
            setfireworklun(true);
            console.log(pattern);
            const utterance = new SpeechSynthesisUtterance(`cartela number ${index} win`);
            window.speechSynthesis.speak(utterance);
        }
    };
    
    const handleNoWin = (initialState, num) => {
        const calledNumbers = calledNumbersRef.current;
        const marked1 = initialState
            .flatMap((row) => row.filter((num) => calledNumbers.includes(num) || num === '*'));
        setmarked(marked1);
        setgamewinnerboard(true);
        console.log(marked1);
        if (language === "am") {
            const notwin = playerNotwin();
            notwin.play();
        } else if (language === "amf") {
            const notwin = playerNotwinf();
            notwin.play();
        } else {
            let message = "you click wrong pattern";
            const utterance = new SpeechSynthesisUtterance(message);
            window.speechSynthesis.speak(utterance);
        }
    };
    
  
    const cheakwin1 = async (initialState, num) => {
        const calledNumbers = calledNumbersRef.current;
        const lastCalledNumber = lastCalledNumberRef.current;
    
        // Number is not part of the cartela
        if (!cartelas.flat().includes(num)) {
            if (language == "am") {
                gameisnot();
            }
           else if (language == "amf") {
                gameisnotf();
            }
            else {
                const utterance = new SpeechSynthesisUtterance("the number is not in the list");
                window.speechSynthesis.speak(utterance);
            }
            return;
        }
    
        // Helper function to check if the last called number is in the pattern
        const includesLastCalledNumber = (pattern) => pattern.includes(lastCalledNumber);
    
        // Fully marked rows
        const fullyMarkedRows = initialState.filter(row =>
            row.every(num => calledNumbers.includes(num) || num === '*')
        );
    
        console.log("Fully marked rows: ", fullyMarkedRows); // Debugging
    
        // Fully marked columns
        const fullyMarkedColumns = [];
        for (let i = 0; i < 5; i++) {
            const column = initialState.map(row => row[i]);
            if (column.every(num => calledNumbers.includes(num) || num === '*')) {
                fullyMarkedColumns.push(column);
            }
        }
    
        console.log("Fully marked columns: ", fullyMarkedColumns); // Debugging
    
        // Fully marked diagonals (accounting for the middle `*`)
        const diagonals = [
            [initialState[0][0], initialState[1][1], initialState[2][2], initialState[3][3], initialState[4][4]],
            [initialState[0][4], initialState[1][3], initialState[2][2], initialState[3][1], initialState[4][0]],
        ];
    
        const fullyMarkedDiagonals = diagonals.filter(diagonal =>
            diagonal.every(num => num === '*' || calledNumbers.includes(num))
        );
    
        console.log("Fully marked diagonals: ", fullyMarkedDiagonals); // Debugging
    
        // Fully marked corners
        const corners = [initialState[0][0], initialState[0][4], initialState[4][0], initialState[4][4]];
        const cornersWin = corners.every(num => calledNumbers.includes(num) || num === '*');
    
        console.log("Corners Win: ", cornersWin); // Debugging
    
        // Last called number validation for two rows, columns, or diagonals
        if (fullyMarkedRows.length >= 2 && 
            (fullyMarkedRows.some(row => includesLastCalledNumber(row)))) {
            return declareWin("Two rows are fully marked!", fullyMarkedRows.flat());
        }
    
        if (fullyMarkedColumns.length >= 2 && 
            (fullyMarkedColumns.some(col => includesLastCalledNumber(col)))) {
            return declareWin("Two columns are fully marked!", fullyMarkedColumns.flat());
        }
    
        if (fullyMarkedDiagonals.length >= 2 && 
            (fullyMarkedDiagonals.some(diagonal => includesLastCalledNumber(diagonal)))) {
            return declareWin("Two diagonals are fully marked!", fullyMarkedDiagonals.flat());
        }
    
        // Row + Diagonal Win (ensure last called number is in either the row or diagonal)
        if (fullyMarkedRows.length >= 1 && fullyMarkedDiagonals.length >= 1 &&
            (fullyMarkedRows.some(row => includesLastCalledNumber(row)) || 
            fullyMarkedDiagonals.some(diagonal => includesLastCalledNumber(diagonal)))) {
            return declareWin("One row and one diagonal are fully marked!", [...fullyMarkedRows.flat(), ...fullyMarkedDiagonals.flat()]);
        }
    
        // Column + Diagonal Win (ensure last called number is in either the column or diagonal)
        if (fullyMarkedColumns.length >= 1 && fullyMarkedDiagonals.length >= 1 &&
            (fullyMarkedColumns.some(col => includesLastCalledNumber(col)) || 
            fullyMarkedDiagonals.some(diagonal => includesLastCalledNumber(diagonal)))) {
            return declareWin("One column and one diagonal are fully marked!", [...fullyMarkedColumns.flat(), ...fullyMarkedDiagonals.flat()]);
        }
    
        // For combinations of one row and one column, one row and one diagonal, etc., no need for the last called number check
        if (fullyMarkedRows.length >= 1 && fullyMarkedColumns.length >= 1 &&
            (fullyMarkedRows.some(row => includesLastCalledNumber(row)) || 
            fullyMarkedColumns.some(col => includesLastCalledNumber(col)))) {
            return declareWin("One row and one column are fully marked!", [...fullyMarkedRows.flat(), ...fullyMarkedColumns.flat()]);
        }
    
        if (fullyMarkedRows.length >= 1 && fullyMarkedDiagonals.length >= 1 &&
            (fullyMarkedRows.some(row => includesLastCalledNumber(row)) || 
            fullyMarkedDiagonals.some(diagonal => includesLastCalledNumber(diagonal)))) {
            return declareWin("One row and one diagonal are fully marked!", [...fullyMarkedRows.flat(), ...fullyMarkedDiagonals.flat()]);
        }
    
        if (fullyMarkedColumns.length >= 1 && fullyMarkedDiagonals.length >= 1 &&
            (fullyMarkedColumns.some(col => includesLastCalledNumber(col)) || 
            fullyMarkedDiagonals.some(diagonal => includesLastCalledNumber(diagonal)))) {
            return declareWin("One column and one diagonal are fully marked!", [...fullyMarkedColumns.flat(), ...fullyMarkedDiagonals.flat()]);
        }
    
        if (cornersWin) return declareWin("Four corners are fully marked!", corners);
    
        console.log("fully marked rows", fullyMarkedRows.length);
        console.log("fully marked columns", fullyMarkedColumns.length);
        console.log("fully marked diagonals", fullyMarkedDiagonals.length);
    
        // Notify if no win is found
        notifyNoWin(initialState);
    };
    
    
    const declareWin = (message, markedNumbers) => {
        console.log(message); 
        const message2="player win";// Debugging
        setmarked1(markedNumbers.map(num => findCoordinates(num, winstate2)));
        setgamewinnerboard1(true);
        setfireworklun(true);
      //  language === "am" ? getGameWining().play() : speak(message);
        if (language === "am") {
            getGameWining().play();
        } else if (language === "amf") {
            getGameWiningfeamel().play();
        } else {
            speak(message);// Handle other cases if needed
        }
    };
    
    const notifyNoWin = (initialState) => {
        const markedNumbers = initialState.flatMap((row, rowIndex) =>
            row.map((num, cellIndex) => {
                if (calledNumbersRef.current.includes(num) || num === '*') {
                    return [rowIndex, cellIndex];
                }
                return null;
            }).filter(item => item !== null)
        );
    
        console.log("Marked Numbers for no win: ", markedNumbers); // Debugging
    
        setmarked1(markedNumbers);
        setgamewinnerboard1(true);
       // language === "am" ? playerNotwin().play() : speak("You clicked the wrong pattern.");
        if (language === "am") {
            playerNotwin().play();
        } else if (language === "amf") {
            playerNotwinf().play();
        } else {
            speak("You clicked the wrong pattern.");// Handle other cases if needed
        }
    };

    
    
    const findCoordinates = (num, state) => {
        for (let rowIndex = 0; rowIndex < state.length; rowIndex++) {
            const cellIndex = state[rowIndex].indexOf(num);
            if (cellIndex !== -1) return [rowIndex, cellIndex];
        }
        return null;
    };
    
    const speak = (message) => {
        const utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
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
             <option value="am">Amharic Male</option>
             <option value="amf">Amharic FeMale</option>
         </select>
     </div>}
         <div className="mainbody">
             <div className="board-container">
             <div className='subnumb'>
                 <div className="current-number">
                     <div className="inner-circle">
                         <p>{currentNumber}</p>
                     </div>
                 </div>
                 <div className='realtime'>
                 <div className="current-number2">
     <small>call length</small>
                         <p >{numberCallLength}</p>
                     </div>
                    
                 </div>
                
                     </div>
                 <div className='Colum'>
                     <button  style={{ backgroundColor: "red",fontWeight: "bold" ,fontSize: "36px"}}>B</button>
                     <button style={{ backgroundColor: "blue" ,fontWeight: "bold",fontSize: "36px"}}>I</button>
                     <button style={{ backgroundColor: "green",fontWeight: "bold" ,fontSize: "36px"}}>N</button>
                     <button style={{ backgroundColor: "yellow",fontWeight: "bold",fontSize: "36px" }}>G</button>
                     <button style={{ backgroundColor: "purple",fontWeight: "bold" ,fontSize: "36px"}}>O</button>
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
                 <input type="number" id="numberInput" onChange={handleChange} disabled={cartelas.length === 0||isGenerating} className='chekinput' name="numberInput" min="0" step="1"/> 
                 <button className="claim_button" disabled={cartelas.length === 0} onClick={claimNumber}>cheak</button>
                 <button className="Leav_button"  disabled={cartelas.length === 0||isGenerating} onClick={newgamet}>Start Game</button>
                     <button className="start_button" disabled={cartelas.length === 0||isGenerating} onClick={startGamer}>Resume</button>
                    
                     <button className="puse_button" disabled={cartelas.length === 0} onClick={handleStop}>puse</button>
                     <button className="Next_button"disabled={isGenerating}onClick={newgame}>New Game</button>
                  
                    
                    </div>
                    {isnavbar && (
 <div className="dropdown-container">
     {/* Display the selected time */}
     <p className="selected-time">
         Selected time: {selectedOption / 1000} seconds
     </p>

     {/* Dropdown toggle button */}
     <button
         className="dropdown-toggle"
         onClick={() => setIsOpen(!isOpen)}
     >
         {/* Display selected option or default text */}
         {options.find((option) => option.value === selectedOption)?.label || "Select Time"}
         <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
     </button>

     {/* Dropdown menu */}
     {isOpen && (
         <ul className="dropdown-menu">
             {options.map((option) => (
                 <li key={option.value}>
                     <button
                         className="dropdown-item"
                         onClick={() => {
                             setSelectedOption(option.value); // Update selected option
                             setIsOpen(false); // Close dropdown
                         }}
                     >
                         {option.label}
                     </button>
                 </li>
             ))}
         </ul>
     )}

     {/* Next Shuffle button */}
     <button
         className="Next_shuffle"
         disabled={cartelas.length >= 1} // Disable if cartelas has at least one item
         onClick={handleShuffle}
     >
         Shuffle
     </button>
 </div>
)}

               
    {!isnavbar && 
     <div className="maincalldisplay">
       <div className="maincalldisplay">
       <div className="maincalldisplay">
       <div className="maincalldisplay">
  {displayarray.map((callb, index) => {
    // Extract only the number part from the value (e.g. "B-15" => 15)
    const number = parseInt(callb.split('-')[1]);

    let outerCircleBackground = ''; // Default outer circle background color
    let outerCircleBorder = ''; // Default outer circle border color

    // Set outer circle background and border color based on the number range
    if (number <= 15) {
      outerCircleBackground = 'white';
      outerCircleBorder = 'red';
    } else if (number <= 30) {
      outerCircleBackground = 'white';
      outerCircleBorder = 'blue';
    } else if (number <= 45) {
      outerCircleBackground = 'white';
      outerCircleBorder = 'green';
    } else if (number <= 60) {
      outerCircleBackground = 'white';
      outerCircleBorder = 'yellow';
    } else if (number <= 75) {
      outerCircleBackground = 'white';
      outerCircleBorder = 'purple';
    }

    return (
      <button
        key={index}
        className="numbercalldis"
        style={{
          backgroundColor: outerCircleBackground, // Outer circle background color
          borderColor: outerCircleBorder, // Outer circle border color
        }}
      >
        {callb} {/* Display the original value (e.g., "B-15") */}
      </button>
    );
  })}
</div>

</div>

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
         
       <h3> win by  cartela number {lastCalledNumberRef.current}</h3>
       
       <div className="bingoboard2w">
 
 <div className="B"  >B</div>
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
 {gamewinnerboard1 &&
   <div className="popupw" id="bingoPopup">
   <div className="popup-contentw">

       <h3> win by  cartela number {winernumber}</h3>
       <h3> win by  cartela number {winernumber}</h3>
      
       
       <div className="bingoboard2w">
 
 <div className="B">B</div>
<div className="I">I</div>
<div className="N">N</div>
<div className="G">G</div>
<div className="O">O</div>

</div>
<div className="playCartela3w">
   
   {carts3}


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
                 {Array.from({ length: 75 }, (_, i) => (
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