import React, {createContext, useEffect, useState} from 'react';
import Player from './Player';
import Search from './Search';
import LoginPage from './LoginPage';
import Home from './Home';
import Decision from './Decision';
import Navigation from './Navigation';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp';
import SearchUser from './SearchUser';
import { getSocket } from './SocketService';



const socket = getSocket();

//export const PlayerContext = createContext();

function ContextInit () {
    
    const [count, setCount] = useState(0);
    const [isLogged, setIsLogged] = useState();
    
    return (
        <>
            <BrowserRouter>
                    <Routes>
                        <Route index element={<Decision />} />
                        <Route path="/SignUp" element={<SignUp />} />
                        <Route path="/LoginPage" element={<LoginPage />} />
                    </Routes>
                    
                </BrowserRouter>
        </>
    );
}

export default ContextInit;