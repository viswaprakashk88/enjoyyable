import React, { createContext, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

export const PlayerContext = createContext();




const extractedSong = JSON.parse(window.localStorage.getItem("songDetails"));

function IndexHelp () {
    const [spotifyPlayer, setSpotifyPlayer] = useState(null);
    const [songDetails, setSongDetails] = useState(extractedSong);
    const [partyMode, setPartyMode] = useState(false);
    const [groupTab, setGroupTab] = useState(1);
    const [groupName, setGroupName] = useState("");
    //Spotify Web Playback Initialiazation
    document.title = "Enjoyabl";
    window.onSpotifyWebPlaybackSDKReady = async () => {
        const player = new window.Spotify.Player({
            name : 'Prakash Application for Spotify',
            getOAuthToken : callback => { callback(window.localStorage.getItem('accessToken'))},
            volume : 1.0
        });
        //Setting the spotifyPlayer
        setSpotifyPlayer(player);
        // console.log(window.localStorage.getItem("username"));
    }
    return (
        (spotifyPlayer) ?
            (<PlayerContext.Provider value={{ spotifyPlayer, setSpotifyPlayer, songDetails, setSongDetails, partyMode, setPartyMode, groupTab, setGroupTab, groupName, setGroupName}}>
                <App />
            </PlayerContext.Provider> )
            :
            (<div>Loading...</div>)
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(    
    <IndexHelp />
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
