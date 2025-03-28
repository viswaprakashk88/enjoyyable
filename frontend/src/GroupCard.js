import React, { useContext } from 'react';
import { PlayerContext } from '.';

function GroupCard ({groupData}) {
    //To display Group Name
    const groupName1 = groupData.groupName.split(" ").map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(" ");
    //Appending the group members into groupMembers variable to display the members under the Group Name except the admin
    const groupMembersTemp = groupData.groupMembers.split("#&#").slice(0,-1).join(", @");
    const groupMembers = groupMembersTemp.length>50 ? groupMembersTemp.slice(0,50) + "..." : groupMembersTemp ;
    const {groupName, setGroupName, setGroupTab, groupTab} = useContext(PlayerContext);
    const handleGroupCardClick = () => {
        setGroupName(groupName1);
        setGroupTab(3);
        console.log(groupData.groupName + ", " +groupTab);
    };
    return (
        <>
            <tr onClick = {handleGroupCardClick} className = "groupCard">
                <td className = "groupCardName">
                    <h4>{groupName1}</h4>
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