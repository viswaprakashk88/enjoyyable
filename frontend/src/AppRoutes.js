import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUp from './SignUp';

function AppRoutes() {
    return (
        <BrowserRouter >
            <Router>
                <Routes>
                    <Route path="/LoginPage" element={<LoginPage />} />
                    <Route path="/SignUp" element={<SignUp />} />
                </Routes>
            </Router>
        </BrowserRouter>
    );
}

export default AppRoutes;
