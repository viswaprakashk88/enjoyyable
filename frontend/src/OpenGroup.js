import React, { useContext, useEffect } from 'react';
import { PlayerContext } from '.';
import leftArrow from './leftArrow.png';

function OpenGroup () {
    const {groupName,groupTab, setGroupTab} = useContext(PlayerContext);
    
    const handleBackButton = () => {
        setGroupTab(1);
    };
    return (
        <div>
            <center>
                <br/>
                <img className = "groupBackButton" src = {leftArrow} width = "33px" height = "33px" onClick = {handleBackButton} /> &emsp;&emsp;
                <b style = {{fontSize : "30px"}}>{groupName}</b>
                
            </center>
        </div>
    );
}

export default OpenGroup;