import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"


function Login() {
    const history=useNavigate();

    const [phonenumber,setEmail]=useState('')
    const [username,setPassword]=useState('')
    async function submit(e){
        e.preventDefault();

        try{

            await axios.post("http://127.0.0.1:3001/signupB",{
                phonenumber,username
            })
            .then(res=>{
                if(res.data=="exist"){
                    alert("User already exists")
                }
                else if(res.data=="notexist"){
                  //  history("/home",{state:{id:username}})
                    history("/mainmenu",{state:{id:phonenumber,user:username}})
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


    return (
        <div className="login">

            <h1>Signup</h1>
 
            <form action="POST">
                 
  <h2>Phone Number and Username</h2>
      <div className="form-group">
        <label htmlFor="phone-number">Phone Number:</label>
        <input
          type="tel"
          id="phone-number"
          value={phonenumber}
          onChange={(e) => { setEmail(e.target.value) }}
          placeholder="Enter phone number"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => { setPassword(e.target.value) }}
       
          placeholder="Enter username"
          className="form-control"
        />
      </div>
      <button  onClick={submit} type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
            <br />
            <p>OR</p>
            <br />

            <Link to="/">Login Page</Link>

        </div>
    )
}

export default Login