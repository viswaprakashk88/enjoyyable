import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MusicAnimation from './MusicAnimation.gif';

function SongCard ({songDetails, index}) {
    const [isCurrentSong, setIsCurrentSong] = useState(window.localStorage.getItem("currentSongId") === songDetails.id);

    return (
        <tr className = "disableSelect" title = {songDetails.name}>
            <td style = {{display: 'none'}}>
                {index}
            </td>
            <td>
                {!isCurrentSong &&
                    <i id = 'hidden' className = "fa-solid fa-play fa-xl songCardAlign" style = {{padding: "-100px"}}></i>
                }
                { isCurrentSong && <img style = {{width: "40px", height: "40px", marginLeft: "10px"}} src = {MusicAnimation} />}
            </td>
            <td>
                <img width = "45px" height = "40px" className = 'songCardAlign songCardImage' src = {songDetails.album.images.length>0 && songDetails.album.images[2].url} />
            </td>
            <td>
                <h4 className = 'songCardAlign' style = {{color : isCurrentSong ? "#49f5a2" : "#fff", textShadow: isCurrentSong ? "2px 1px 6px #49f5a2" : ""}}>{songDetails.name.length >= 40 ? songDetails.name.slice(0,39) : songDetails.name}{songDetails.name.length >= 40 ? "..." : ""}</h4>
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