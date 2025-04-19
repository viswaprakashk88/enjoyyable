import React, { useContext, useEffect, useState, useRef } from 'react';
import { initializeSocket, getSocket, disconnectSocket } from './SocketService';
import {CurrentSong} from './Search';
import io from "socket.io-client";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { PlayerContext } from './index';

var intervalForSlider = null;
function Player () {

  const {spotifyPlayer, setSpotifyPlayer, songDetails, setSongDetails, partyMode, setPartyMode} = useContext(PlayerContext);
  const socket = getSocket();
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  useEffect( () => {
    spotifyPlayer.connect().then(success => {
      if (success) {
        console.log("Connected Successfully!");
      }
      else{
          console.log("Failed")
      }
    });
    //ready Listener for spotifyPlayer
    spotifyPlayer.addListener('ready', ({device_id}) => {
      setDeviceId(device_id);
    });
    spotifyPlayer.addListener('player_state_changed', ({device_id}) => {
      setIsStarted(true);
      if ( window.localStorage.getItem("previous_song") !== songDetails.id ) {
        setSliderValue(0);
        window.localStorage.setItem("previous_song", songDetails.id)
      }
    });

    return () => {
      spotifyPlayer.removeListener('player_state_changed');
    }
  }, [songDetails]);



  // Now, the slider will only start when the isStarted is true
  useEffect ( () => {
    if (isPlaying) {
      document.getElementById("toggleButton").classList.remove("fa-play");
      document.getElementById("toggleButton").classList.add("fa-pause");
    }
    if (isPlaying && isStarted) {
      intervalForSlider = setInterval( () => {
        setSliderValue(prevValue => prevValue + 100);
      }, 100);
      if (sliderValue > songDetails.duration_ms) {
        clearInterval(intervalForSlider);
      }
    }
    return () => {
      clearInterval(intervalForSlider);
    }
  }, [isPlaying, isStarted, intervalForSlider]);

  useEffect(()=>{
    
    //When Socket trigger receive_message 
    socket.on("receive_message", (datas) => {
      document.getElementById('messages').innerHTML+="<b style='color:white'>"+datas.socketId+" : "+datas.sentMessage+"</b> : <b>"+datas.timeSent+"</b><br>";
    });

    socket.on("receive_songDetails", (datas) => {
      console.log("received song details in player");
      console.log(datas);
    });


    //When Socket trigger receive_playerListener 
    socket.on("receive_playerListener", (data) => {
      
    });


    
    //Cleaning up all the listeners
    return () => {
      if (socket) {
        socket.off("receive_message");
        socket.off("receive_playerListener");
      }
      
    };

  }, [socket]);

  //Removing Slider if the sliderValue exceeds songDetails.duration_ms
  useEffect ( () => {
    if (songDetails && sliderValue > songDetails.duration_ms) {
      clearInterval(intervalForSlider);
      setSliderValue(0);
    }
  }, [sliderValue]);

  useEffect( () => {
    //function to play a song
    const playSong = ({songDetails},deviceId) => {

      clearInterval(intervalForSlider);
      setIsPlaying(true);

      if (isPlaying) {
        intervalForSlider = setInterval( () => {
          setSliderValue(prevValue => prevValue + 100);
        }, 100);
        if (sliderValue > songDetails.duration_ms) {
          clearInterval(intervalForSlider);
        }
      }
      console.log(deviceId);

      fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${window.localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [songDetails ? songDetails.uri : null]
        }),
      })
        .then(response => { 
          if (response.ok) {
            console.log('Playback started!');
          } else {
            console.error('Failed to start playback:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Error starting playback:', error);
        });
    }
    console.log(deviceId);
    // if (deviceId !== "") {
      playSong({songDetails}, deviceId);

    // }
    

  }, [songDetails]);

  //Function for play/pause button
  const togglePlay = () => {
    var toggleButton = document.getElementById("toggleButton");
    clearInterval(intervalForSlider);
    // setSongDetails(JSON.parse(window.localStorage.getItem("songDetails")));

    if (partyMode) {
      console.log("socket emissions will happen....");
      // socket.emit("sendToggledInfo",);
    }

    if (spotifyPlayer) {
      if (isPlaying) {
        spotifyPlayer.pause();
        setIsPlaying(false);
        toggleButton.classList.remove("fa-pause");
        toggleButton.classList.add("fa-play");
      }
      else {
        setIsPlaying(true);
        spotifyPlayer.seek(sliderValue);
        spotifyPlayer.resume();
        toggleButton.classList.remove("fa-play");
        toggleButton.classList.add("fa-pause");
      }
    }
  };

  //Function for player slider Change
  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value));
    if (spotifyPlayer && isPlaying === true) {
      spotifyPlayer.seek(e.target.value);
    }
  }
  const screenWidth = window.screen.width + "px";
  
  return (
      <div className = "fixed containered" id = "player" style = {{width: screenWidth}}>
        <div className = "left">
          <div className = "playerImageSection">
            <span>
              <img src = {songDetails && songDetails.album.images.length > 0 && songDetails.album.images[0].url} style = { {width: "77px", height : "77px", border: "3px solid #8684f2", borderRadius: "5px", boxShadow : "3px 3px  3px 3px 7px #49f5a2" } }/>
            </span>
            <span>
              { songDetails && songDetails.name.length > 12 && 
              <marquee id = "playerSongName" style ={{fontSize: "23px", fontWeight: "bold", width: "200px",fontFamily: "Sans-serif", color: "#1392f2", marginLeft: "20px"}}> {songDetails && songDetails.name} </marquee>

              }
              { songDetails && songDetails.name.length <= 12 && <span id = "playerSongName" style ={{fontSize: "23px", fontWeight: "bold",fontFamily: "Sans-serif", color: "#1392f2", marginLeft: "20px"}}> {songDetails && songDetails.name} </span>}

            </span>
          </div>
        </div>
        <div className = 'center'>
          <center>
            <b style = {{paddingTop : "10px", fontSize: "17px"}}>{Math.floor(sliderValue/60000) < 10 && '0'}{Math.floor(sliderValue/60000)}:{Math.floor(sliderValue/1000) % 60 < 10 && '0'}{Math.floor(sliderValue/1000)  % 60}</b>
            &emsp;
            <input type = "range" min = "0" value = {sliderValue} onChange = {handleSliderChange} max = {songDetails ? songDetails.duration_ms.toString() : 0} id = "playerSlider" />
            &emsp;
            <b style = {{paddingTop : "10px", fontSize: "17px"}}>{songDetails && songDetails.duration_ms/60000 < 10 && "0"}{songDetails ? Math.floor(songDetails.duration_ms/60000) : "0"}:{songDetails && (songDetails.duration_ms/1000)%60 < 10 && "0"}{songDetails ? Math.floor(songDetails.duration_ms/1000)%60 : "0"}</b>
            <br/>
            <i className = "fa-solid fa-backward-step fa-2xl paddingPlay" id = "backward"></i>
            <i className="fa-solid fa-play fa-2xl paddingPause" style = { {color: "#ddede8"} } onClick = {togglePlay} id = "toggleButton"></i>
            <i className = "fa-solid fa-forward-step fa-2xl paddingPlay" id = "forward"></i>
          </center>
        </div>
      </div>
  );
}

export default Player;