import { useRef } from 'react';
import axios from "axios";
import { FaBars, FaTimes } from 'react-icons/fa';
import React from 'react';
import { useState } from 'react';
import '../components/Nav.css';
import Cookies from "js-cookie";
import {useLocation, useNavigate} from 'react-router-dom';
import { useEffect } from 'react';

  

 

function Navbar() {
  const token=localStorage.getItem('accesstoken');
console.log("thetokenal",token);
const [username,setUser]=useState('');
  const navRef = useRef();
const location=useLocation();
const history=useNavigate();
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  
useEffect(() => {
  const token = localStorage.getItem('accesstoken');
  console.log("thetokenal",token);
  if (!token) {
    //alert("User not found");
    history("/");}
  } , []);
  useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    
    if (!token) {
      alert("User not found");
    } else {
      axios.post(`${BACKEND_URL}/useracess`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        const username = res.data.username;
        setUser(username);
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Failed to verify user");
      });
    }
  }, []);  // Empty dependency array ensures this runs once on component mount
 

const handlelogin=()=>{
  history('/logins');
}
 
  const handlelogout=()=>{
 Cookies.remove('accesstoken');

 // Clear persisted storage (optional)
 localStorage.removeItem('accesstoken');
 sessionStorage.removeItem('accesstoken');

 // Clear React state or Redux store (if applicable)
 //setUser(null); // Example if using React Context or useState.
 // dispatch({ type: 'LOGOUT' }); // Example if using Redux.

 // Redirect to login page
 history('/logins');
 }
 
 

 // Optional: Clear any other sensitive data
 console.log('User logged out successfully.');
  const showNavBar = () => {
    navRef.current.classList.toggle('responsive_nav');
  };
  const gotoCartela=()=>{
    history("/NewGame") 
  }
  const gotohelp=()=>{
    history("/Helpdesk") 
  }
  const gotogame=()=>{
    history("/StackPage") 
  }
  const gotohome=()=>{
 
      history("/BingoBoard")
    
    
  }
  const gotohistory=()=>{
    history("/GameHistory")
  }
   const gototransfer=()=>{
    history("/Mainmenu")
  }
 
  return (
    <header>
      <nav ref={navRef}>
      {token?(
        <>
      <button className="Home" aria-label="House User" onClick={gotohome}>
  <i className="fa-solid fa-house-user" onClick={gotohome}></i> {/* House User Icon */}
 HOME
</button>
         

        <button className="history" aria-label="Game History" onClick={gotohistory}>
           <i className="fa-solid fa-history" onClick={gotohistory}></i> {/* History Icon */}
                Game History
                </button>
                <button className="wallet" aria-label="Wallet" onClick={gototransfer}>
  <i className="fa-solid fa-wallet" onClick={gototransfer}></i> {/* Wallet Icon */}
  Wallet
</button>

        <button className="help" aria-label="Help" onClick={gotohelp}>
       <i className="fa-solid fa-question-circle" onClick={gotohelp}></i> {/* Question Circle Icon */}
                              Help
                   </button>
        <button className="nav-btn1 nav-close-btn" onClick={showNavBar}>
          <FaTimes />
        </button>
    <button onClick={handlelogout}>LogOut</button></>):(<div><h1>to continue the game pleas click login</h1><button onClick={handlelogin}>login</button> </div>)} 
      </nav>
    
      <button className="nav-btn1" onClick={showNavBar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
