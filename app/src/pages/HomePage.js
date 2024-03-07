// HomePage.jsx
import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout/Layout";
import { useNavigate } from 'react-router-dom';
import { useSession } from "../globalStates/session.state";
import axios from "axios";


const HomePage = () => {

    const navigate = useNavigate();
    const [sessionState, sessionAction] = useSession();


    useEffect(() => {
        if (!sessionState.name) {
            axios.post(`http://localhost:8005/api/Layout/get_session_data.php`).then(res => {
                if (res.data.errors == 0) {
                    sessionAction.setSession(res.data.session_data);
                } else {
                    return navigate("/login");
                }
            })
        }
    }, []);


    return (
        <Layout>
             <h1 className="text-center font-semibold p-3 text-4xl">Welcome to the E-Jail!</h1>

        </Layout>
    );
}

export default HomePage;
