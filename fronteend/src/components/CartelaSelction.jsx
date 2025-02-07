import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './CartelaSelction.css';
import {useLocation, useNavigate} from 'react-router-dom';

function CartelaSelction() {
    const location=useLocation();
    const history=useNavigate();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
   const [isOpen, setIsOpen] = useState(false);
   const [opengame,setopengame]=useState(false);
    const options = [2,  4,  7,  10];
    const percentoptions = [
        { label: "10%", value: 0.1 },
        { label: "15%", value: 0.15},
        { label: "20%", value: 0.2 },
       
    ];
    const [selectedpercent, setSelectedpercent] = useState(0.2);
    const gametype = [
        { label: "one cheak", value: 1},
        { label: "two cheak", value: 2},
        
       
    ];
    const [selectegametype, setSelectgametype] = useState(1);
    localStorage.setItem('language',location.state.language);
    let  language= localStorage.getItem('language');
    const [selectedStake, setSelectedStake] = useState(20); // Default stake is 10
   
        console.log(language);
    const handleStakeChange = (event) => {
        setSelectedStake(parseInt(event.target.value));
    };
    const [numbers, setNumbers] = useState(() => {
        const storedNumbers = localStorage.getItem("selectedNumbers");
        // Check if storedNumbers exists and is a valid JSON array
        try {
            const parsedNumbers = storedNumbers ? JSON.parse(storedNumbers) : [];
            return Array.isArray(parsedNumbers) ? parsedNumbers : []; // Ensure it's an array
        } catch (error) {
            console.error("Error parsing stored numbers:", error);
            return []; // Default to empty array on parse error
        }
    });

    useEffect(() => {
        localStorage.setItem("selectedNumbers", JSON.stringify(numbers));
    }, [numbers]);
    const startGame = () => {
        
        
        // Delay navigation slightly to allow "game started" to finish
        setTimeout(() => {
            history("/BingoBoard", { state: { cartelas: numbers,selectegametype:selectegametype,stake: selectedStake, selectedpercent:selectedpercent} });
            localStorage.removeItem("selectedNumbers");
        }, 1000); // 1-second delay
    };
    const getGameStartedAudio = () => {
        const audio= new Audio('/gamestatus/game_ready_tostart.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;
    };
   
    const handleButtonClick = (num) => {
        setNumbers((prevNumbers) => {
            // Ensure prevNumbers is an array
            if (Array.isArray(prevNumbers)) {
                if (prevNumbers.includes(num)) {
                    return prevNumbers.filter((number) => number !== num);
                } else {
                    return [...prevNumbers, num];
                }
            }
            return [num]; // Fallback if prevNumbers is not an array
        });
    };

    return (
        <React.Fragment>
            <Navbar />
            <div className="Cartelacontainer">
                {[...Array(100).keys()].map((index) => {
                    const num = index + 1;
                    return (
                        <button 
                            key={num} 
                            onClick={() => handleButtonClick(num)} 
                            className="cartela" 
                            style={{ background: numbers.includes(num) ? 'red' : '#eeeeee',color:numbers.includes(num) ?'yellow':'black' }}
                        >
                            {num}
                        </button>
                    );
                })}
               
            </div>
            
            <div className='cartelacomand_bord'>
                <div className='Play'>
                <button className="game_start" disabled={numbers.length <= 1} onClick={startGame }>START</button>

              </div>
              <div className="percentoption">
    {/* Dropdown toggle button */}
    <button className="dropdown-toggle" onClick={() => setopengame(!opengame)}>
        {/* Display selected game type label or default text */}
        {gametype.find((option) => option.value === selectegametype)?.label || "Select gametype"}
        <span className={`arrow ${opengame ? "open" : ""}`}>▼</span>
    </button>

    {/* Dropdown menu */}
    {opengame && (
        <ul className="dropdown-menu">
            {gametype.map((option) => (
                <li key={option.value}>
                    <button
                        className="dropdown-item"
                        onClick={() => {
                            setSelectgametype(option.value); // Update selected game type
                            setopengame(false); // Close dropdown
                        }}
                    >
                        {option.label}
                    </button>
                </li>
            ))}
        </ul>
    )}
</div>

                <div className="percentoption">
    {/* Dropdown toggle button */}
    <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {/* Display selected percent label or default text */}
        {percentoptions.find((option) => option.value === selectedpercent)?.label || "Select percent"}
        <span className={`arrow ${isOpen ? "open" : ""}`}>▼</span>
    </button>

    {/* Dropdown menu */}
    {isOpen && (
        <ul className="dropdown-menu">
            {percentoptions.map((option) => (
                <li key={option.value}>
                    <button
                        className="dropdown-item"
                        onClick={() => {
                            setSelectedpercent(option.value); // Update selected percent
                            setIsOpen(false); // Close dropdown
                        }}
                    >
                        {option.label}
                    </button>
                </li>
            ))}
        </ul>
    )}
</div>

                <div className='Stakeplace'>
            <h2>Select a Stake</h2>
            <div className='stakevalue'>
                <label>
                    <input
                        type="radio"
                        value="10"
                        checked={selectedStake === 10}
                        onChange={handleStakeChange}
                    />
                    10
                </label>
                <label>
                    <input
                        type="radio"
                        value="20"
                        checked={selectedStake === 20}
                        onChange={handleStakeChange}
                    />
                    20
                </label>
                <label>
                    <input
                        type="radio"
                        value="30"
                        checked={selectedStake === 30}
                        onChange={handleStakeChange}
                    />
                    30
                </label>
                <label>
                    <input
                        type="radio"
                        value="40"
                        checked={selectedStake === 40}
                        onChange={handleStakeChange}
                    />
                    40
                </label>
                <label>
                    <input
                        type="radio"
                        value="50"
                        checked={selectedStake === 50}
                        onChange={handleStakeChange}
                    />
                    50
                </label>
                <label>
                    <input
                        type="radio"
                        value="100"
                        checked={selectedStake === 100}
                        onChange={handleStakeChange}
                    />
                    100
                </label>
                <label>
                    <input
                        type="radio"
                        value="200"
                        checked={selectedStake === 200}
                        onChange={handleStakeChange}
                    />
                    200
                </label>
            </div>
           
        </div>
               </div>
            
        </React.Fragment>
    );
}

export default CartelaSelction;
