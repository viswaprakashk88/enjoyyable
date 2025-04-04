import React, { useContext, useState } from 'react';
import { PlayerContext } from '.';
import GroupCard from './GroupCard';

function GroupsTab () {
    const {groupTab, setGroupTab} = useContext(PlayerContext);
    const cachedGroups = window.localStorage.getItem("groups") ? JSON.parse(window.localStorage.getItem("groups")) : [];
    const [groupsList, setGroupsList] = useState(cachedGroups && cachedGroups.items || []);

    useState( async () => {
        if ( !window.localStorage.getItem("groups") ) {
            var groups = await fetch ("https://localhost:3001/getGroups", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    username : window.localStorage.getItem("username")
                })
            });
            groups = await groups.json();
            window.localStorage.setItem("groups", JSON.stringify(groups));
            setGroupsList(groups.items);
        }
        console.log();
    }, []);

    return (
        <div>
            <br/>
            <br/>
            <center>
                {groupsList.length < 1 && <h4>Your Groups Will Appear Here</h4>}
                <table>
                    <tbody>
                        {groupsList.map((item, index) => (
                            <GroupCard key={index} data-index={index} groupData = {item} />
                        ))}
                    </tbody>
                </table>
            </center>

            <div className = "createGroupButton" onClick={ () => {setGroupTab(2)} }><i className="fa fa-plus" aria-hidden="true"></i> Create Group</div>
        </div>
    );
}


export default GroupsTab;