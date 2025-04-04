import React, { useContext } from 'react';
import { PlayerContext } from '.';

import MusicAnimation from './MusicAnimation.gif';

function GroupCard ({groupData}) {
    //To display Group Name
    const groupName1 = groupData.groupName.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ");
    //Appending the group members into groupMembers variable to display the members under the Group Name except the admin
    const groupMembersTemp = groupData.groupMembers.split("#&#").slice(0,-1);
    
    const groupMembers = groupMembersTemp.length>50 ? groupMembersTemp.join(", @").slice(0,50) + "..." : groupMembersTemp.join(", @") ;

    const {groupName, setGroupName, setGroupTab, groupTab, setGroupMembers, setCreatedOn, setGroupId} = useContext(PlayerContext);
    const handleGroupCardClick = () => {
        setGroupName(groupName1);
        setGroupTab(3);
        setGroupMembers(groupData.groupMembers.split("#&#"));
        setCreatedOn(groupData.dateTime);
        setGroupId(groupData.groupid);
    };
    return (
        <>
            <tr onClick = {handleGroupCardClick} className = "groupCard">
                <td className = "groupCardName">
                    <h4>{groupName1} {true ? <img src = {MusicAnimation} style = {{width: "40px", height: "40px", marginTop: "-10px"}} /> : ""}</h4>
                    <h6>@{groupMembers}</h6>
                </td>
            </tr>
            <tr>
                <td style = {{margin: "10px"}}></td>
            </tr>
        </>
    );
}

export default GroupCard;