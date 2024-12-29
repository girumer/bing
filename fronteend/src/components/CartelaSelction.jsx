import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './CartelaSelction.css';
import {useLocation, useNavigate} from 'react-router-dom';

function CartelaSelction() {
    const location=useLocation();
    const history=useNavigate();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
   
    const options = [2,  4,  7,  10];
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
            history("/BingoBoard", { state: { cartelas: numbers, stake: selectedStake } });
            localStorage.removeItem("selectedNumbers");
        }, 1000); // 1-second delay
    };
    const getGameStartedAudio = () => {
        const audio= new Audio('/gamestatus/game_ready_tostart.mp3');
        audio.preload = "auto"; // Preload to reduce delay
        return audio;
    };
    console.log(numbers.length);
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
                        value="50"
                        checked={selectedStake === 50}
                        onChange={handleStakeChange}
                    />
                    50
                </label>
            </div>
           
        </div>
               </div>
            
        </React.Fragment>
    );
}

export default CartelaSelction;
