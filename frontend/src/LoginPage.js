import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import { PlayerContext } from './index';
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom';
import App from './App';
import Home from './Home';
import md5 from "md5";

function LoginPage () {
    const {spotifyPlayer, setSpotifyPlayer, songDetails, setSongDetails, isSearch, setIsSearch} = useContext(PlayerContext);
    const navigate = useNavigate();
    console.log("inside LoginPage.js");
    console.log(spotifyPlayer !== null);

    useEffect (() => {
            if (window.localStorage.getItem("username") !== null) {
                console.log("endhuku ivanni niku");
                navigate('/');
            }
            console.log(md5("Ssp@gmail8"));
        }, [navigate]);

    async function handleSubmit (e) {
        e.preventDefault();
        console.log(spotifyPlayer !== null);
        const username = e.target.username.value;
        const hashedPassword = md5(e.target.password.value);
        console.log(hashedPassword);
        
        const loginSuccess = await fetch("https://localhost:3001/checkLoginCredentials?un=" + username + "&pw=" + hashedPassword);
        const loginSuccessJSON = await loginSuccess.json();

        if (loginSuccessJSON.loginStatus === "success") {
            navigate('/');
            window.localStorage.setItem("username", username);
        }
        else{
            document.getElementById("codered").style.display = "inline";
        }

    }
    return (
        <>
        <br/>
        <br/>
        <center>
            <div className = 'login-box'>
                <p style = {{fontSize: "25px", fontFamily: "fantasy"}}>Please Login To Your Account</p>
                <form onSubmit={handleSubmit} method = "POST">
                    <table>
                        <tbody>
                            <tr>
                                <td className = "td">
                                    <input className = "loginbar" type = "text" id = "username" name = "username" placeholder = 'Enter Username or Email' autoFocus/>
                                </td>
                            </tr>
                            <tr>
                                <td className = "td">
                                    <input className = "loginbar" name = "password" type = "password" id = "password" placeholder = 'Enter Password'/>
                                </td>
                            </tr>
                            <tr>
                                <td  className = "td">
                                    <input type = "submit" className = "submitButton" value = "Submit" />
                                </td>
                            </tr>
                            <tr>
                                <td className = "td" colSpan="2" style = {{padding: "0px"}}><b className='codered' id = "codered">Invalid Credentials</b></td>
                            </tr>
                            <tr>
                                <td  className = "td" colSpan="2" style = {{fontSize : "22px"}}>
                                    Don't Have An Account? Signup <Link to="/Signup">Here</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
            <Link to = "/Search" id = "searchLink" style={{display: 'none'}}>Search</Link>
        </center>
        </>
    );
}


export default LoginPage;