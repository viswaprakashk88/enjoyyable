import React, { useContext, useEffect } from 'react';
import { PlayerContext } from '.';

function OpenGroup () {
    const {groupName} = useContext(PlayerContext);
    

    return (
        <>
            <center>
                <b>{groupName}</b>
                {/* <b>hello</b> */}
            </center>
        </>
    );
}

export default OpenGroup;