import React, { useEffect, useState } from 'react';

function UserCard ({userData}) {
    const connections = JSON.parse(window.localStorage.getItem("connections"));
    const [friendStatus, setFriendStatus] = useState("Connect");
    var name = userData.name.split("#%#");
    var name = name[0] === window.localStorage.getItem("name") ? name[1] : name[0];
    const presentName = window.localStorage.getItem("name");
    useEffect( () => {
        if (connections && userData.user in connections && document.getElementById("requestButton_" + userData.user)) {

            setFriendStatus(connections[userData.user] === "friends" ? "✅Friends" : (connections[userData.user] === "requested you" ? "Requested You" : "Request Sent"));
            
            document.getElementById("requestButton_" + userData.user).disabled = true;
            document.getElementById("requestButton_" + userData.user).classList.remove("userCardRequestButtonEnabled");
            document.getElementById("requestButton_" + userData.user).classList.add("userCardRequestButtonDisabled");
        }
    });
    const request = async (e) => {
        const date = new Date();
        const splittedParts = e.target.value.split("&#&");
        const nameCurrentUser = JSON.parse(window.localStorage.getItem("userInfo"));


        var result = await fetch("https://localhost:3001/sendConnectionRequest", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                sendFromUsername : window.localStorage.getItem("username"),
                sendToUsername : splittedParts[0],
                sendTime : date.getTime(),
                sendName : splittedParts[1],
                sendMyName : nameCurrentUser.name
            })
        });
        result = await result.json();
        // console.log(result);
        setFriendStatus("Requested")
        document.getElementById("requestButton_" + userData.user).disabled = true;
        document.getElementById("requestButton_" + userData.user).classList.remove("userCardRequestButtonEnabled");
        document.getElementById("requestButton_" + userData.user).classList.add("userCardRequestButtonDisabled");
    }
    return (
        <>
            <tr className = 'userCardSection'>
                <td className = "userCardName">
                    <h3>{name}</h3>
                    <h5  className = "userCardUsername">@{userData.user}</h5>
                </td>
                <td className = "userCardButton">
                    <button id = {"requestButton_" + userData.user} className = "userCardRequestButton userCardRequestButtonEnabled" value = { userData.user + "&#&" + userData.name }  onClick = {request}>{friendStatus}</button>
                </td>
            </tr>
            <tr className = "spacing">
                <td></td>
            </tr>
            <tr className = "spacing">
                <td></td>
            </tr>
        </>
    );
}

export default UserCard;