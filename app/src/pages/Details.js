import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import HardwareIcon from '@mui/icons-material/Hardware';
// Import removed for HistoryIcon since it's no longer used

const Details = () => {
    let { id } = useParams();
    const [hardwareDetails, setHardwareDetails] = useState(null);

    const renderData = (data) => {
        if (data && typeof data === 'object' && data.date) {
            return new Date(data.date).toLocaleString();
        }
        return data;
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8005/api/getHardwareDetailsAndHistory.php?id=${id}`);
            if (response.data && response.data.hardwareDetails) {
                setHardwareDetails(response.data.hardwareDetails);
            } else {
                console.error('No data found for this ID:', id);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    if (!hardwareDetails) return <div className="text-center p-5">Loading...</div>;

    return (
        <Layout>
            <div className="container mx-auto p-5">
                <div className="flex flex-col md:flex-row">
                    <div className="p-4 shadow-lg rounded bg-white m-2 w-full">
                        <h2 className="text-xl font-semibold mb-2 flex items-center">
                            <HardwareIcon className="mr-2" /> Hardware Details
                        </h2>
                        <ul className="list-disc pl-5">
                            {hardwareDetails && Object.entries(hardwareDetails).map(([key, value]) => (
                                <li key={key}><strong>{key}:</strong> {renderData(value)}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Details;
