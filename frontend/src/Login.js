import React, { useEffect , useState} from 'react';


const loginButtonStyle = {color:'white'};
const CLIENT_ID = "f4144083fb1c4f58bada3b64b623cd7b";
const CLIENT_SECRET = "1df80b623981441fbcff2859408b8d77";
const REDIRECT_URI = "https://localhost:3000/";
const scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming user-read-email user-read-private' ;
const AUTHORIZATION_URL = "https://accounts.spotify.com/authorize?client_id="+CLIENT_ID+"&response_type=code&redirect_uri="+REDIRECT_URI+"&scope="+scope;

function Login() {
    useEffect(() => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log("Attempting for Login");
        };
        
    },[]);
    
    return (
        <div>
            <a style = {loginButtonStyle} href = "https://localhost:3001/login" >Login To Spotify</a>
        </div>

    );
}

export default Login;