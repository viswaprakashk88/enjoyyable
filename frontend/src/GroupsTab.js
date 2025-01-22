import React, { useContext, useState } from 'react';
import { PlayerContext } from '.';

function GroupsTab () {
    const {groupTab, setGroupTab} = useContext(PlayerContext);
    return (
        <div>
            <center>
                
            </center>
            <div class = "createGroupButton" onClick={ () => {setGroupTab(2)} }><i class="fa fa-plus" aria-hidden="true"></i> Create Group</div>
        </div>
    );
}


export default GroupsTab;