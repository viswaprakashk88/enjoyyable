import React, { useEffect, useState } from 'react';

function RequestCard ({userData}) {
    var name = userData.name.split("#&#")[0];
    name = name.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ");
    const username = userData.username.split("#&#")[0];
    const [buttonText, setButtonText] = useState("Accept");
    
    const accept = async (e) => {
        setButtonText("✅Friends")
        document.getElementById("requestButton_" + e.target.value).classList.add("userCardRequestButtonDisabled");
        document.getElementById("requestButton_" + e.target.value).classList.remove("userCardRequestButtonEnabled");
        const time = e.target.value;
        var acceptance = await fetch("https://localhost:3001/acceptRequest", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                username : window.localStorage.getItem("username"),
                time : time
            })
        });
        acceptance = await acceptance.json();
        console.log(acceptance);
        window.localStorage.removeItem("requestsList");
        window.localStorage.removeItem("requestsCount");
    }

    return (
        <>
            <tr className = 'userCardSection'>
                <td className = "userCardName">
                    <h3>{name}</h3>
                    <h5  className = "userCardUsername">@{username}</h5>
                </td>
                <td className = "userCardButton">
                    <button id = {"requestButton_" + userData.time} className = "userCardRequestButton userCardRequestButtonEnabled" value = { userData.time } onClick = {accept} >{buttonText}</button>
                </td>
            </tr>
            <br/>
        </>
    );
}
export default RequestCard;