import React, { useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';


function SongCard ({songDetails, index}) {
    useEffect( () => {
        // console.log("good morning from songcard");
        return function cleanup() {
            // console.log("good evening from songcard");
        };
    },[]);
    return (
        <tr>
            <td style = {{display: 'none'}}>
                {index}
            </td>
            <td>
                <i id = 'hidden' className = "fa-solid fa-play fa-xl songCardAlign" style = {{padding: "-100px"}}></i>
            </td>
            <td>
                <img width = "45px" height = "40px" className = 'songCardAlign songCardImage' src = {songDetails.album.images.length>0 && songDetails.album.images[2].url} />
            </td>
            <td>
                <h4 className = 'songCardAlign'>{songDetails.name}</h4>
            </td>
            {/* <td>
                <i className = "fa-sharp fa-solid fa-plus songCardAlign songCardAlignIcon"></i>
            </td>
            <td>
            <i className = "fa-solid fa-ellipsis-vertical songCardAlign songCardAlignIcon"></i>
            </td> */}
        </tr>
    );
}

export default SongCard;