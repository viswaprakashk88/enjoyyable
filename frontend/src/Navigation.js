import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Search from './Search';
import SearchUser from './SearchUser';
import { PlayerContext } from './index';
import Player from './Player';
import Navbar from './Navbar';
import { getSocket } from './SocketService';
import Requests from './Requests';
import { ResourceGroups } from 'aws-sdk';
import Groups from './Groups';



const socket = getSocket();
// export const tabContext = createContext();
function Navigation() {

    const [tabNumber, setTabNumber] = useState(1);
    const [profileHover, setProfileHover] = useState(false);
    const {spotifyPlayer, partyMode, setPartyMode} = useContext(PlayerContext);

    const navigate = useNavigate();
    useEffect ( () => {
        if (window.localStorage.getItem("username") === null) {
            navigate("/");
        }

        window.addEventListener("keydown", (e) => {
            if (e.shiftKey && e.key === 'A') {
                console.log("we got it");
            }
        });
        async function getUserInfo () {
            var userInfo = await fetch("https://localhost:3001/getUserInfo", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    username : window.localStorage.getItem("username")
                })
            });
            userInfo = await userInfo.json();
            window.localStorage.setItem("userInfo",JSON.stringify(userInfo["items"]["Items"][0]));
            window.localStorage.setItem("name",userInfo["items"]["Items"][0].name);
        }
        getUserInfo();
        if (window.localStorage.getItem("searchedSongName")) {
            window.localStorage.removeItem("searchedSongName");
            window.localStorage.removeItem("searchedSongList");
            console.log("removing searchedSongsName");
        }
        async function getRequests () {
            var requests = await fetch("https://localhost:3001/getAllRequests", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    username: window.localStorage.getItem("username")
                })
            });
            requests = await requests.json();
            console.log(requests);
            window.localStorage.setItem("requestsList",JSON.stringify(requests["items"]));
            window.localStorage.setItem("requestsCount", requests["items"].length);
        }
        getRequests();
    },[]);

    useEffect( () => {
        if (tabNumber !== 2 && window.localStorage.getItem("connections") && !window.localStorage.getItem("searchedUser")) {
            window.localStorage.removeItem("connections");
        }
    }, [tabNumber]);

    const handleLogout = () => {
        window.localStorage.clear();
        spotifyPlayer.disconnect();
        navigate("/");
    }

    return (
        <div>
            <div className = "profile-section">
                <i class="fa fa-user profile-icon" aria-hidden="true" id = "profileIcon" onMouseOver = {() => {setProfileHover(true)} } onMouseLeave = { () => {setTimeout(() => {setProfileHover(false)}, 2000)} }></i>
                <div>
                    <ul id = "profileDropdown" onMouseOver={() => {setProfileHover(true)}} onMouseLeave={() => {setProfileHover(false)}} style = {{display: profileHover ? "inline" : "none"}}>
                        <li onClick = {() => {console.log("good profile");}}>Profile</li>
                        <li onClick = {handleLogout}>Log Out</li>
                    </ul>
                </div>
            </div>
            <center>
                <a className={tabNumber === 1 ? "nav-anchor-clicked" : "nav-anchor"} onClick = { () => {setTabNumber(1)} }>Search Songs</a>
                <a className={tabNumber === 2 ? "nav-anchor-clicked" : "nav-anchor"} onClick = { () => {setTabNumber(2)} }>Browse Users</a>
                <a className={tabNumber === 3 ? "nav-anchor-clicked" : "nav-anchor"} onClick = { () => {setTabNumber(3)} }>Groups</a>
                <a className={tabNumber === 4 ? "nav-anchor-clicked" : "nav-anchor"} onClick = { () => {setTabNumber(4)} }>Requests {window.localStorage.getItem("requestsCount") && parseInt(window.localStorage.getItem("requestsCount")) > 0 && <sup style = {{color: "white", backgroundColor: "red", fontSize: "15px", padding: "1px 7px 1px 7px", borderRadius: "90%"}}>{window.localStorage.getItem("requestsCount")}</sup>}</a>
            </center>

            {tabNumber === 1 && <Search/>}
            {tabNumber === 2 && <SearchUser/>}
            {tabNumber === 3 && <Groups/>}
            {tabNumber === 4 && <Requests/>}
            
        </div>
    );
}

export default Navigation;