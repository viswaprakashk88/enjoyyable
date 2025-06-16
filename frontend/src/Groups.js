import React, { useContext, useState } from 'react';
import CreateGroup from './CreateGroup';
import { PlayerContext } from '.';
import GroupsTab from './GroupsTab';
import OpenGroup from './OpenGroup';
import { useEffect } from 'react';

function Groups () {

    const {groupTab, setGroupTab} = useContext(PlayerContext);
    return (
        <div>
            {groupTab === 1 && <GroupsTab/>}
            {groupTab === 2 && <CreateGroup/>}
            {groupTab === 3 && <OpenGroup />}
            {/* <center>
                <h4>Group 1</h4>
                <h4>Group 2</h4>
            </center>
            <div class = "createGroupButton"> <i class="fa fa-plus" aria-hidden="true"></i> Create Group</div> */}
        </div>
    );
}


export default Groups;