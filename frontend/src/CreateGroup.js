
import React, { useContext, useState } from 'react';
import { PlayerContext } from '.';

function CreateGroup () {
    const {groupTab, setGroupTab} = useContext(PlayerContext);
    return (
        <div>
            <center>
                <div className = "createGroupSection">
                    <input className = "groupSectionName" type = "text" id = "groupName" pattern = "[A-Za-z0-9 ]{3,}" placeholder = "Enter A Groud Name" />
                    <br/>
                    <input type = "text" id = "groupId" pattern = "[A-Za-z0-9]{3,}" placeholder = "Enter A Groud ID"/>
                    <br/>
                </div>
            </center>
        </div>
    );
}


export default CreateGroup;