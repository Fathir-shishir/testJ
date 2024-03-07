import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout/Layout";
import BookedInTable from '../components/BookedInTable';
import { useNavigate } from 'react-router-dom';
import { useSession } from "../globalStates/session.state";
import axios from "axios";
import useItems from '../Hooks/useItems';
const Jail = () => {
    const [data, setData] = useItems([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('id'); // 'id' or 'name'
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
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Function to handle search type selection
    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };
    return (
        <Layout>
            <div>
            <BookedInTable data={data} searchTerm={searchTerm} searchType={searchType} onSearchTypeChange={handleSearchTypeChange} />
        </div>
        </Layout>
    );
}

export default Jail;
