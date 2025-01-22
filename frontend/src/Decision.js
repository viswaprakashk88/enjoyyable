import React, { useState, useEffect, useContext } from 'react';
import LoginPage from './LoginPage';
import { getSocket, disconnectSocket } from './SocketService';
import Home from './Home';
import SignUp from './SignUp';
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search';
import { PlayerContext } from './index';
import Navigation from './Navigation';
import Player from './Player';
import Login from './Login';

const socket = getSocket();

function Decision () {
    const [message, setMessage] = useState(null);
    const [spotifyLogged, setSpotifyLogged] = useState(false);
    const [applicationLogged, setApplicationLogged] = useState(false);
    const {spotifyPlayer} = useContext(PlayerContext);
    const [premium, setPremium] = useState(false);
    const navigate = useNavigate();
    
    useEffect ( () => {
        if (window.localStorage.getItem("accessToken") === null ) {
            navigate('/');
        }
        if (window.localStorage.getItem("username") === null ) {
            navigate('/LoginPage');
        }
    },[navigate]);
    // useEffect(() => {
    //     setApplicationLogged(window.localStorage.getItem("username") !== null);
    //     // console.log("inside decision" + spotifyPlayer);
    //     // console.log(applicationLogged);
        
    //     const fetchUserInfo = async() => {
    //         const response = await fetch ("https://api.spotify.com/v1/me", {
    //             headers : {
    //                 Authorization : `Bearer ${window.localStorage.getItem('accessToken')}`
    //             }
    //         });
    //         if (response) {
    //             const temp = await response.json();
    //             console.log(temp);
    //             setPremium(temp.product);
    //         }
    //     };
        
    //     fetchUserInfo();

    //     return () => {
    //         if (socket) {
    //             socket.removeListener('receive_message');
    //             disconnectSocket();
    //         }
    //     };
    // }, []);

    return (
        // (applicationLogged && spotifyPlayer) ? <Home /> : <LoginPage />
        <div id = "navigate">
            {/* {premium === "premium" ? "premium user" : "not a premium user"} */}
            { window.localStorage.getItem("accessToken") === null && <Login/>}
            { window.localStorage.getItem("username") !== null && <Navigation /> }
            { window.localStorage.getItem("username") === null && <LoginPage /> }
            { window.localStorage.getItem("accessToken") !== null && window.localStorage.getItem("username") !== null && <Player /> }

        </div>
    );
}

function IsPremiumUser () {
    const [userInfo, setUserInfo] = useState(null);
    const [premium, setPremium] = useState(false);
    useEffect( () => {
        const fetchUserInfo = async() => {
            const response = await fetch ("https://api.spotify.com/v1/me", {
                headers : {
                    Authorization : `Bearer ${window.localStorage.getItem('accessToken')}`
                }
            });
            const temp = await response.json();
            console.log(temp);
            setPremium(temp.product);
        };
        fetchUserInfo();
        console.log("decision");

    });

    return (
        <div>
            {premium === "premium" && window.localStorage.getItem("username") === null && <LoginPage />}
            {premium === "premium" && window.localStorage.getItem("username") !== null && <Search />}
            {premium === "free" && <BuyPremium />}
        </div>
    );
}

function BuyPremium () {
    return (
        <div className = "buyPremium">
            <center>
                You need a Spotify Premium Account to use this application. You can have get a Premium Account <a href = "https://www.spotify.com/in-en/premium/">Here</a> 😁
            </center>
        </div>
    )
}

export default Decision;
