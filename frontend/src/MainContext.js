import { createContext, useState } from "react";

export const PlayerContext = createContext();

export const MainContext = ({ children }) => {
    const [spotifyPlayer, setSpotifyPlayer] = useState(null);
    const [songDetails, setSongDetails] = useState({});
    const [isSearch, setIsSearch] = useState(false);

    return (
        <PlayerContext.Provider value={{ spotifyPlayer, setSpotifyPlayer, songDetails, setSongDetails, isSearch, setIsSearch }}>
            {children}
        </PlayerContext.Provider>
    );
};