import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Search from './Search';
import SignUp from './SignUp';
import LoginPage from './LoginPage';
import App from './App';

function Routing() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<App />} />
                <Route path="/Search" element={<Search />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/Login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default Routing;