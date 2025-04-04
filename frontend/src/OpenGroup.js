import React, { useContext, useEffect, useState } from 'react';
import { PlayerContext } from '.';
import leftArrow from './leftArrow.png';

function OpenGroup () {
    const {groupName, setGroupTab, groupMembers, createdOn, groupId} = useContext(PlayerContext);
    const cachedNames = window.localStorage.getItem("group_" + groupId) ? JSON.parse(window.localStorage.getItem("group_" + groupId)) : [];
    const [groupMembersList,setGroupMembersList] = useState(cachedNames || []);
    const handleBackButton = () => {
        setGroupTab(1);
    };
    useEffect ( () => {
        if (!window.localStorage.getItem("group_" + groupId)) {
            const getNames = async () => {
                var names = await fetch("https://localhost:3001/getNames", {
                    method: "POST",
                    body: JSON.stringify({
                        usernames: groupMembers
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                names = await names.json();
                if (!names.ok) {
                    console.log("Something Went Wrong!");
                    console.log(names.error_message)
                }
                else {
                    setGroupMembersList(names["items"]);
                    window.localStorage.setItem("group_" + groupId,JSON.stringify(names["items"]));
                }
            };
            getNames();
        }
    });
    return (
        <div>
            <center>
                <br/>
                <img className = "groupBackButton" alt = "" src = {leftArrow} width = "43px" height = "43px" onClick = {handleBackButton} /> &nbsp;
                <b style = {{fontSize : "33px",color: "#c6fc03",textShadow: "1px 1px 2px #fff"}}>{groupName}</b>
                <br/>
                <br/>
                <h6>Created On {createdOn.slice(4,15)}</h6>
                { groupMembersList && groupMembersList.map((item, index) => (
                    <GroupMemberCard key = {index} name = {item.name} username = {item.user} />
                ))}
            </center>
        </div>
    );
}

function GroupMemberCard ({name, username}) {
    const style = {backgroundColor: window.localStorage.getItem("username") === username ? 'Pink' : "#61dafb"};
    const admin = window.localStorage.getItem("username") === username ? " ~Admin" : "";
    return (
        
        <div className = "groupMemberCard" style = {style}>
            {name.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ") + admin}
            <p style = {{fontSize: "17px"}} >@{username}</p>
        </div>
        
    );
}

export default OpenGroup;