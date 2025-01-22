
import './App.css';
import React, { useContext, useEffect , useState} from 'react';
import io from "socket.io-client";
import Login from './Login';
import { initializeSocket, getSocket, disconnectSocket } from './SocketService';
import ContextInit from './ContextInit';
import { BrowserRouter as Router, Route, Routes, Link, BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUp from './SignUp';
import { PlayerContext } from './index';


const code = new URL(window.location.href).searchParams.get("code");
initializeSocket("");
const socket = getSocket();

function App(){

    const [message,setMessage] = useState(null);
    const {spotifyPlayer} = useContext(PlayerContext);
    useEffect( () => {
        if (window.localStorage.getItem("searchedUser"))
        {
            window.localStorage.removeItem("searchedUser");
            window.localStorage.removeItem("searchedUserList");
        }
        if (window.localStorage.getItem("searchedSongsList")) {
            window.localStorage.removeItem("searchedSongName");
            window.localStorage.removeItem("searchedSongsList");
            console.log("thisesa");

        }

        const accessTokenChecker = async () => {
        
            if(!window.localStorage.getItem('accessToken')){
                await fetch('https://localhost:3001/accessToken?code=' + code, {
                    method : 'GET'
                }).then(res => res.json())
                .then(data => {
                    window.localStorage.setItem('accessToken', data.accessToken);
                    window.localStorage.setItem('refreshToken', data.refreshToken);
                    const currentDateTime = new Date();
                    window.localStorage.setItem('accessTokenTime', currentDateTime);
                })
            }
            else{

                //Calculating the time difference between present and the last token retrieval time
                const currentDateTime = new Date();
                const presentTime =currentDateTime.getTime() + '';
                const localStorageTime = new Date(window.localStorage.getItem('accessTokenTime') + '');
                const lastTokenTime = localStorageTime.getTime() + '';
                const timeGapAccessToken = Math.floor((presentTime - lastTokenTime)/1000);
                const refreshToken = window.localStorage.getItem('refreshToken');
                //If the time difference is greater than an hour, retrieve the accessToken again
                if (timeGapAccessToken > 3600) {
                    var accessTokenRefresh = await fetch('https://localhost:3001/refreshToken?refreshToken=' + refreshToken, {
                        method : 'GET'
                    });
                    accessTokenRefresh = await accessTokenRefresh.json();
                    window.localStorage.setItem('accessToken', accessTokenRefresh.accessToken);
                    window.localStorage.setItem('accessTokenTime', currentDateTime);
                }
            }
        }
        accessTokenChecker();
        
        return function cleanup() {
            //removing the socket listeners
            if (socket) {
                socket.removeListener('receive_message');
                disconnectSocket();
            }
        };

    }, []); 
       
    return (
        <div>   
            <center style = {{padding: "10px 8px 8px 8px"}}>
                <h1 style = {{fontSize: "42px"}}>Enjoyabl</h1>
            </center>
            {code || window.localStorage.getItem("accessToken") ? "" : <Login/>}

            <ContextInit />
        </div>
    );    
}




export default App;