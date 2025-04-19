import React, { useEffect, useState } from 'react';
import EditIcon from './EditIcon.png';

function Profile () {
    const [userDetails, setUserDetails] = useState(JSON.parse(window.localStorage.getItem("userInfo")));
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [editText, setEditText] = useState("You Can Edit Your Name");

    useEffect(() => {

        const date = new Date();

        console.log("Time Zone is : " + date.getTimezoneOffset());
        if (userDetails?.name) {
          const capitalized = userDetails.name
            .split(" ")
            .map(item => item.charAt(0).toUpperCase() + item.slice(1))
            .join(" ");
          setName(capitalized);
        }
      }, [userDetails.name]);

    const handleUpdate = async () => {
        var updateName = await fetch("https://localhost:3001/updateName", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                username: window.localStorage.getItem("username")
            })
        });
        updateName = await updateName.json();
        if (!updateName.ok) {
            console.log(updateName.error_message + ": error in the Profile.js");
        }
        else {
            setEditText("Updated The Name Successfully!");
            const updatedUserDetails = {
                ...userDetails,
                name: name
            };
            setUserDetails(updatedUserDetails);
            window.localStorage.setItem("userInfo", JSON.stringify(updatedUserDetails));
        }
    };

    const handleEdit = () => {
        setEditMode(!editMode);
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    }
    const onKeyDownName = (e) => {
        if (e.key === "Enter") {
            handleUpdate();
        }
    }


    return (
        <div>
            <center>
                <div className = "profilePage" >
                    <br />
                    <div style={{ display: "flex", marginBottom: "20px", justifyContent: "center", alignItems: "center" }}>
                        <h3 style={{ marginBottom: 0 }}>Your Details</h3> &emsp;
                        <img src={EditIcon}  onClick = {handleEdit} className="ProfileEditIcon" alt="Edit" />
                    </div>
                    {editMode && <h4 style = {{color: "#f34aba"}}>{editText}</h4>}
                        
                        <table>
                            <tr>
                                <td style = {{fontSize: "20px", color: "#03fcb6", padding: "0px 100px 0px 0px"}} >
                                    <b>Name</b>
                                    <br/>
                                    <input disabled = {!editMode} className = "profileInput" type = "text" name = 'name' value = {name} onChange = {onNameChange} onKeyDown = {onKeyDownName} spellCheck = "false" />
                                </td>
                                <td style = {{fontSize: "20px", color: "#03fcb6"}} >
                                    <b>Username</b>
                                    <br/>
                                    <input disabled = {true} className = "profileInput" type = "text" name = 'username' value = {userDetails.user} spellCheck = "false" />
                                </td>
                            </tr>
                        </table>
                        {/* {window.innerWidth < 600 && <br />}
                        {600 < window.innerWidth && 1024 > window.innerWidth  &&
                            // <b>hi</b>
                            <table>
                                <td style = {{fontSize: "20px", color: "#03fcb6"}} >
                                    <b>Username</b>
                                    <br/>
                                    <input className = "profileInput" type = "text" name = 'username' value = {userDetails.user} />
                                </td>
                            </table>
                        } */}
                        <br/>
                        <table>
                            <tr>
                                <td style = {{fontSize: "20px", color: "#03fcb6", padding: "0px 100px 0px 0px"}} >
                                    <b>Mobile</b>
                                    <br/>
                                    <input disabled = {true} className = "profileInput" type = "text" name = 'mobile' value = {userDetails.mobile} />
                                </td>
                                    <td style = {{fontSize: "20px", color: "#03fcb6"}} >
                                    <b>Email</b>
                                    <br/>
                                    <input disabled = {true} className = "profileInput" type = "email" name = 'email' value = {userDetails.email} />
                                </td>
                            </tr>
                        </table>
                        {/* {window.innerWidth < 600 && <br />}
                        {600 < window.innerWidth && 1024 > window.innerWidth  &&
                            // <b>hi</b>
                            <table>
                                <td style = {{fontSize: "20px", color: "#03fcb6"}} >
                                    <b>Email    </b>
                                    <br/>
                                    <input className = "profileInput" type = "text" name = 'username' value = {userDetails.user} />
                                </td>
                            </table>
                        } */}
                        <br/>
                        <input disabled = {!editMode} type = "submit" style = {{width: "15%"}} onClick = {handleUpdate} className = "submitButton" value = "Update" />
                          
                    <br/>
                    <br/>
                </div>
                
            </center>
        </div>
    )

}

export default Profile;