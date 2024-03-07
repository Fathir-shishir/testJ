import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import BlueTextField from '../components/BlueTextField';
import { LangContext } from "../utils/context/LangContext";
const BookedOutPage = () => {
    const { t } = useContext(LangContext);
    const [formData, setFormData] = useState({
        serialNumber: '',
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8005/api/bookOutHardware.php', {
                serialNumber: formData.serialNumber,
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = response.data;
    
            console.log('Form Data Submitted:', formData);
            console.log('Server Response:', data);
    
            if (data.success) {
                alert('Form submitted successfully: ' + data.success);
                setFormData({
                    serialNumber: '',
                });
            } else if (data.error) {
                alert('Error: ' + data.error);
            } else {
                alert('Unexpected response from the server.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            if (error.response && error.response.data && error.response.data.error) {
                alert('Failed to submit form: ' + error.response.data.error);
            } else {
                alert('Failed to submit form.');
            }
        }
    };

    return (
        <Layout>
            <h1 className="text-center font-semibold p-3 text-4xl">{t("bookOutPage.bookOut")}</h1>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="w-full px-3 mb-6">
                        <BlueTextField
                            label={t("common.serialNumber")}
                            variant="outlined"
                            name="serialNumber"
                            value={formData.serialNumber}
                            onChange={handleChange}
                            fullWidth
                            required 
                            sx={{
                                '& input': {
                                    color: 'black',
                                },
                                '& label': {
                                    color: 'black',
                                },
                                '&.Mui-focused input': {
                                    color: 'black',
                                },
                                '& label.Mui-focused': {
                                    color: 'black',
                                },
                            }} 
                        />
                    </div>
                    <div className="flex justify-center mt-6">
                        <button
                            style={{ backgroundColor: '#a0f630', color: 'white', fontWeight: 'bold', padding: '8px 16px', borderRadius: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8ecf2d'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#a0f630'}
                            type="submit"
                        >
                           {t("buttons.submit")}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

export default BookedOutPage;
