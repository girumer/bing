import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './GameHistory.css';
import Navbar from '../components/Navbar';
import ReactPaginate from 'react-paginate';
import _ from 'lodash';
import Cookies from "js-cookie";
const GameHistory = ({ playerId }) => {
  const location = useLocation();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL||"https://adeybingo-11.onrender.com";
  const navigate=useNavigate();
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  // Set localStorage items once when location state changes
/*   useEffect(() => {
    if (location.state?.id && location.state?.user) {
      localStorage.setItem('phoneNumber', location.state.id);
      localStorage.setItem('username', location.state.user);
    }
  }, [location.state]); */
  //const phone='0932157512'
 
  const token=localStorage.getItem('accesstoken');
  console.log(token);
  //const username = localStorage.getItem('username');
  const pageCount = gameHistory ? Math.ceil(gameHistory.length / rowsPerPage) : 0;

  /* useEffect(() => {
    const token = localStorage.getItem('accesstoken');
     if (!token) {
alert("user not founn");
       
     }
     else{
       axios.post("http://localhost:3001/useracess", {token})
       .then(res=>{
       // console.log(res.data)
       const username=res.data.username;
       // const role=res.data.role;
        setUser(username);
        })
      
       //navigate("/dashbord");
     }
   }, []); */
   useEffect(() => {
    const token = localStorage.getItem('accesstoken');
    
    if (!token) {
      //alert("User not found");
      navigate("/");
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
  }, []);
  // Fetch game history
  useEffect(() => {
    const fetchGameHistory = async () => {
      if (!user) return; 
      try {
        const response = await axios.post(`${BACKEND_URL}/api/getHistory`, { user});
        setGameHistory(response.data);
       // setUser(username);
      } catch (err) {
        setError('Error fetching game history');
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGameHistory();
  }, [user]);

  // Handler for pagination
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const indexOfLastPage = (currentPage + 1) * rowsPerPage;
  const indexOfFirstPage = indexOfLastPage - rowsPerPage;
  const currentPosts = gameHistory.slice(indexOfFirstPage, indexOfLastPage);

  if (loading) return <div>Loading game history...</div>;
  if (error) return <div>{error}</div>;

  return (
    <React.Fragment>
      <Navbar />
      {token?(
        <>
      <div className="game-history-container">
        <h2>Dear {user}, here is your Game History</h2>
        <table className="game-history-table">
          <thead>
            <tr>
              
              <th>GameID</th>
              <th>TotalCash</th>
              <th>payforagenet</th>
              <th>PayeForVendor</th>
              <th>PayForPlayer</th>
              <th>Stake</th>
             
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((game, index) => (
              <tr key={index}>
                
                <td>{game.gameId}</td>
                <td>{game.totalcash}</td>
                <td>{game.awardforagen}</td>
                <td>{game.PayeForVendor}</td>
                <td>{game.PayForPlayer}</td>
                <td>{game.stake}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          previousLabel={'Previous'}
          nextLabel={'Next'}
        />
      </div></>):(<h1>Pleas logiin</h1>)}
    </React.Fragment>
  );
};

export default GameHistory;
