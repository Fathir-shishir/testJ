import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BookInPage from './pages/BookInPage';
import BookOutPage from './pages/BookedOutPage';
import Dashboard from './pages/Dashboard';
import Jail from './pages/Jail';

import DetailsPage from './pages/Details';

// Global States
import { useSession } from './globalStates/session.state';

// Utils
import { LangProvider } from './utils/context/LangContext';

// Styles
import './styles/App.css';

function App() {
    const navigate = useNavigate();
    const [sessionState, sessionAction] = useSession();

    // Check user session on app load
    useEffect(() => {
        axios.post(`http://localhost:8005/api/Layout/check_session.php`)
            .then(res => {
                if (res.data.isSessionValid) {
                    // Session is valid, set session data
                    sessionAction.setSession(res.data.sessionData);
                } else {
                    // Session is not valid, redirect to login
                    navigate("/login");
                }
            }).catch(error => {
                console.error('Error checking session:', error);
            });
    }, [navigate, sessionAction]); // Dependencies

    return (
        <div className="App">
            <LangProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/jail" element={<Jail />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/bookIn" element={<BookInPage />} />
                    <Route path="/bookOut" element={<BookOutPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/details/:id" element={<DetailsPage />} />

                    {/* Redirect user to home if session exists, else to login */}
                    <Route path="/" element={sessionState.name ? <HomePage /> : <LoginPage />} />
                </Routes>
            </LangProvider>
        </div>
    );
}

export default App;
