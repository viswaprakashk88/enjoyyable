import React, { useContext } from 'react';
import Search from './Search';
import Player from './Player';
import { PlayerContext } from './ContextInit';

function Home () {
    // const {spotifyPlayer, setSpotifyPlayer, songDetails, setSongDetails, isSearch, setIsSearch} = useContext(PlayerContext);
    console.log("Inside Home.js");
    // console.log(spotifyPlayer);
    console.log("Inside Home.js");
    return (
        <div>
            <Search typeOfView="fromSearch" />
            <Player />
        </div>
    );
}

export default Home;