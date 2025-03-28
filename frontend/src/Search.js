import React, {useState, useEffect, useContext, createContext} from 'react';
import SongCard from './SongCard';
import { PlayerContext } from './index';
import LoadingAnimation from './LoadingAnimation.gif';
import SearchSongsAnimation from './SearchSongsAnimation.gif';


function Search() {
    const searchedSongName = window.localStorage.getItem("searchedSongName");
    const {songDetails, setSongDetails} = useContext(PlayerContext);
    const [currentQueryString,setCurrentQueryString] = useState(searchedSongName && searchedSongName !== "undefined"? searchedSongName : "");
    const [searchedList, setSearchedList] = useState([]);
    const [searched, setSearched] = useState(false);
    const [songClick, setSongClick] = useState(0);

    useEffect ( () => {
        //Getting the already cached data into the page
        if (window.localStorage.getItem("searchedSongsList") && window.localStorage.getItem("searchedSongsList") !== "undefined")
        {
            setCurrentQueryString("Previously Searched Songs");
            document.getElementById("searchSong").value = window.localStorage.getItem("searchedSongName");
            setSearchedList(JSON.parse(window.localStorage.getItem("searchedSongsList")));
            document.getElementById("searchSong").autofocus = true;
        }
    },[]);

    // useEffect( () => {
    //     const tempList = searchedList;
    //     setSearchedList(tempList);
    // }, [songDetails]);


    const searchSong = async (e) => {
        var searchSongs = document.getElementById("searchSong");
        if(e.key === "Enter" && searchSongs.value !== "") {
            setSearched(true);
            setCurrentQueryString("Showing Results For " + '"'+ searchSongs.value + '"');
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
            setSearched(false);
            setCurrentQueryString("");
            window.localStorage.removeItem("searchedSongsList");
            window.localStorage.removeItem("searchedSongName");
        }
    }
    const handleSongClick = (e) => {
        const row = e.target.closest('tr');
        if (!row) {return;}
        var id = parseInt(e.target.closest('tr').children[0].innerHTML);
        if (isNaN(id) || !searchedList[id]) {return;}
        // console.log(id);
        setSearchedList(searchedList);
        setSongClick(prev => prev + 1);
        var songObject = searchedList[id];
        if (songObject.is_playable) {
            window.localStorage.setItem("currentSongId", searchedList[id].id);
            setSongDetails(songObject);
            setSongClick(prev => prev + 1);
            window.localStorage.setItem("songDetails", JSON.stringify(searchedList[id]));
            console.log(songDetails);
        }
    }

    return(
        <div style = {{padding: "0px 0px 120px 0px"}}>
            <center>
                <input type = "text" name = 'searchSong' id = 'searchSong' onKeyPress={searchSong} className = "searchBar" placeholder='Hit Enter To Search Something' spellCheck = "false" />
                <div id = "songsList">
                    <h4 id = "searchedSongName" style = { {color: "#14f5cf", paddingBottom: "10px"} }>{ currentQueryString !== "" && currentQueryString.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ")}</h4>
                    <table style = {{width: "auto"}} onClick = {handleSongClick}>
                        <tbody key={songClick}>
                            {searchedList.map((item, index) => (
                                <SongCard key={index} data-index={index} songDetails={item} index = {index} />
                            ))}
                        </tbody>
                    </table>
                    {searchedList.length < 1 && searched && <img src = {LoadingAnimation} style = {{width: "100px",height: "100px"}} />}
                    {!searched && searchedList.length < 1 && <img style = {{width: "300px",height: "300px"}} src = {SearchSongsAnimation} />}
                </div>
            </center>
        </div>
        
    )
}

export default Search;
