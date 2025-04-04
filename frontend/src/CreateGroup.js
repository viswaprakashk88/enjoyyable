
import React, { useContext, useEffect, useState } from 'react';
import { PlayerContext } from '.';
import LoadingAnimation from './LoadingAnimation.gif';

function CreateGroup () {
    const {groupTab, setGroupTab} = useContext(PlayerContext);
    const [membersList, setMembersList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [codeRed, setCodered] = useState("none");
    const [codeColor, setCodecolor] = useState("");
    const [codeMessage, setCodemessage] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);

    useEffect ( () => {

        if (window.localStorage.getItem("friendsList")) {
            setFriendsList(JSON.parse(window.localStorage.getItem("friendsList")));
        }
        else {
            const getFriends = async () => {
                var response = await fetch ("https://localhost:3001/getFriends", {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify({
                        username : window.localStorage.getItem("username")
                    })
                });
                response = await response.json();
                console.log("getFriends route is here");
                console.log(response);
                if (response["items"].length > 0) {
                    var responseItems = response["items"];
                    responseItems.sort((a,b) => {return a.username.localeCompare(b.username)});
                    window.localStorage.setItem("friendsList", JSON.stringify(responseItems));
                    setFriendsList(responseItems);
                    console.log(responseItems);
                }
                setIsLoaded(true);
            }
            getFriends();
        }
    }, []);

    useEffect ( () => {
        var tempMembers ="";
        var tempString = "";
        for (var i = 0; i < membersList.length; i++) {
            tempString = membersList[i].username.replaceAll(window.localStorage.getItem("username") + "", "");
            tempString = tempString.replaceAll("#&#", "");
            console.log(tempString);
            tempMembers += tempString + "#&#";
        }
        tempMembers+=window.localStorage.getItem("username");
        setGroupMembers(tempMembers);
    }, [membersList])

    const handleSubmit = async () => {
        document.getElementById("submitButton").innerHTML += " <i className='fa fa-spinner' aria-hidden='true'></i>";
        const groupName = document.getElementById("groupName").value;
        const groupId = document.getElementById("groupId").value;
        console.log(groupId === "")
        if (groupId === "") {
            setCodemessage("Please Enter Group ID");
            setCodecolor("red");
            setCodered("inline");
            document.getElementById("submitButton").innerHTML = "Create Group";
            return;
        }
        if (groupName === "") {
            setCodemessage("Please Enter Group Name");
            setCodecolor("red");
            setCodered("inline");
            document.getElementById("submitButton").innerHTML = "Create Group";
            return;
        }
        if (membersList.length === 0) {
            setCodemessage("Add Group Members To Continue");
            setCodecolor("red");
            setCodered("inline");
            document.getElementById("submitButton").innerHTML = "Create Group";
            return;
        }
        var groupIdCheck = await fetch("https://localhost:3001/checkGroupId", {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                groupIdname : groupId
            })
        });
        // console.log(groupIdCheck);
        groupIdCheck = await groupIdCheck.json();
        console.log(groupIdCheck);
        if (groupIdCheck["exists"]) {
            setCodered("inline");
            setCodemessage("Group ID Already Exists!");
            setCodecolor("red");
            // document.getElementById("submitButton").innerHTML = "Create Group";
            return;
        }
        const presentTime = new Date();
        var creatingGroup = await fetch("https://localhost:3001/createGroup", {
            method : "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                groupName : groupName,
                groupIdname : groupId,
                groupMembers : groupMembers,
                groupAdmin : window.localStorage.getItem("username"),
                dateTime: presentTime + ""
            })
        });
        creatingGroup = await creatingGroup.json();
        if (creatingGroup.ok && creatingGroup.created) {
            setCodered("inline");
            setCodecolor("#2af563");
            setCodemessage("Group Created Successfully!");
            setGroupTab(1);
        }
        else {
            setCodered("inline");
            document.getElementById("submitButton").innerHTML = "Create Group";
            setCodecolor("#f5ca89");
            setCodemessage("Something Went Wrong...");
        }
    }


    const addMember = (e) => {
        const indexToAdd = parseInt(e.target.value, 10);
        var memberToAdd = friendsList[indexToAdd];
        var tempFriendsList = friendsList.filter( (item, index) => {
            return index !== indexToAdd;
        });
        tempFriendsList.sort((a,b) => {return a.username.localeCompare(b.username)});
        setMembersList((prev) => [...prev, memberToAdd]);
        setFriendsList(tempFriendsList);
        // setFriendsList(tempFriendsList);
        
    }

    const removeMember = (e) => {
        const indexToRemove = parseInt(e.target.value, 10);
        var memberToRemove = membersList[indexToRemove];
        var tempFriendsList = friendsList;
        tempFriendsList.push(memberToRemove);
        tempFriendsList.sort((a,b) => {return a.username.localeCompare(b.username)});
        setMembersList((prevList) => prevList.filter((_, index) => index !== indexToRemove));
        setFriendsList(tempFriendsList);
    }



    const getName = (name, username) => {
        const splittedUsername = username.split("#&#");
        const splittedName = name.split("#&#");
        if (splittedUsername[0] === window.localStorage.getItem("username")) {
            return splittedName[1].split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ");
        }
        return splittedName[0].split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ");
    };

    const handleCancel = () => {
        setGroupTab(1);
    };
    return (
        <div>
        {(friendsList.length > 0 || membersList.length >0) ? (
            
                <center>
                    <div className = "createGroupSection">
                        <h3 style = {{margin: "5px 10px 20px -320px", color : "#d4f51b"}}>Create Group</h3>
                        {/* <br/> */}
                        <input className = "groupSectionName" type = "text" id = "groupName" pattern = "[A-Za-z0-9 ]{3,}" placeholder = "Enter A Groud Name" spellcheck="false" required />
                        <input className = "groupSectionName" type = "text" id = "groupId" pattern = "[A-Za-z0-9]{3,}" placeholder = "Enter A Groud ID" spellcheck="false" required />
                        <br/>
                        <div className = "createGroupMembers">
                            <h5 style = {{margin: "-10px 10px 10px -260px", color : "#1346ed"}}>Members <span style = {{fontSize: "15px"}}>(Tap To Remove)</span></h5>
                            {
                                membersList.map((item,index) => (
                                    <button className = "createGroupMembersButton" onClick = {removeMember} value = {index} title = {"Remove " + item}>
                                        {getName(item.name, item.username)}
                                    </button> 
                                ))
                            }
                        </div>
                        <br/>
                        <div className = "createGroupMembers" style = {{marginTop: "-10px"}}>
                            <h5 style = {{margin: "-10px 10px 10px -261px", color : "#1346ed"}}>Your Friends <span style = {{fontSize: "15px"}}>(Tap To Add)</span></h5>
                            {
                                friendsList.map((item,index) => (
                                    <button className = "createGroupMembersButton" onClick = {addMember} value = {index}  title = {"Add " + item.name}>
                                        { getName(item.name, item.username) }
                                    </button> 
                                ))
                            }
                        </div>
                        <h4 style = {{display: codeRed, color: codeColor}}>{codeMessage}<br/></h4>
                        
                        <button className = "createGroupSubmit" id = "submitButton" onClick = {handleSubmit} >Create Group</button>
                        <button className = "cancelGroup" onClick = {handleCancel}>Cancel</button>
                    </div>

                </center>
            ) : (<center className = "loading">
                    {(isLoaded) ? "Make some friends to create a group" : <img src = {LoadingAnimation} style = {{width: "100px",height: "100px"}} />}
                </center>) }
            </div>
    )
}


export default CreateGroup;