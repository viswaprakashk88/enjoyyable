import React, {useState, useEffect, useContext, createContext} from 'react';
import SongCard from './SongCard';
import { PlayerContext } from './index';



function Search() {
    const searchedSongName = window.localStorage.getItem("searchedSongName");
    const {songDetails, setSongDetails} = useContext(PlayerContext);
    const [currentQueryString,setCurrentQueryString] = useState(searchedSongName && searchedSongName !== "undefined"? searchedSongName : "");
    const [searchedList, setSearchedList] = useState([]);

    useEffect ( () => {
        //Getting the already cached data into the page
        if (window.localStorage.getItem("searchedSongName") && window.localStorage.getItem("searchedSongName") !== "" )
        {
            document.getElementById("searchSong").value = window.localStorage.getItem("searchedSongName");
            setSearchedList(window.localStorage.getItem("searchedSongsList") !== "undefined" ? JSON.parse(window.localStorage.getItem("searchedSongsList")) : []);
            document.getElementById("searchSong").autofocus = true;
        }
    },[]);


    const searchSong = async (e) => {
        var searchSongs = document.getElementById("searchSong");
        if(e.key === "Enter" && searchSongs.value !== "") {
            setCurrentQueryString(searchSongs.value);
            var songs = await fetch("https://api.spotify.com/v1/search?q=" + document.getElementById('searchSong').value + '&type=track&access_token=' + window.localStorage.getItem("accessToken"))
            songs = await songs.json();
            if (songs.tracks) {
                setSearchedList(songs.tracks.items);
                window.localStorage.setItem("searchedSongsList", JSON.stringify(songs.tracks.items));
                window.localStorage.setItem("searchedSongName", searchSongs.value);
            }
        }
        else {
            setSearchedList([]);
            setCurrentQueryString("");
            window.localStorage.removeItem("searchedSongsList");
            window.localStorage.removeItem("searchedSongName");
        }
    }
    const handleSongClick = (e) => {
        var id = parseInt(e.target.closest('tr').children[0].innerHTML);
        // console.log(id);
        var songObject = searchedList[id];
        if (songObject.is_playable) {
            setSongDetails(songObject);
            window.localStorage.setItem("songDetails", JSON.stringify(searchedList[id]));
        }
    }

    return(
        <div style = {{padding: "0px 0px 120px 0px"}}>
            <center>
                <input type = "text" name = 'searchSong' id = 'searchSong' onKeyPress={searchSong} className = "searchBar" placeholder='Hit Enter To Search Something' spellCheck = "false" />
                <div id = "songsList">
                    <h4 id = "searchedSongName" style = { {color: "#14f5cf", paddingBottom: "10px"} }>{ currentQueryString !== "" && "Showing Results For " + '"' +  currentQueryString.charAt(0).toUpperCase() + currentQueryString.slice(1) + '"'}</h4>
                    <table style = {{width: "auto"}} onClick = {handleSongClick} >
                        <tbody>
                            {searchedList.map((item, index) => (
                                <SongCard key={index} data-index={index} songDetails={item} index = {index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </center>
        </div>
        
    )
}

export default Search;
