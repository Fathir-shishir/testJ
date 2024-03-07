import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import Autocomplete from '@mui/material/Autocomplete';
import BlueTextField from '../components/BlueTextField'; // Make sure this path is correct for your project
import { LangContext } from "../utils/context/LangContext";


const BookInPage = () => {
    const { t } = useContext(LangContext);
    const [formData, setFormData] = useState({
        currentStatus: 'In',
        partNumber: '',
        // Removed serialNumber from formData initialization
        quantity: '', // Set default quantity value to 1 and keep it hidden from the form
        partDefinitionsId: ''
    });
    const [partDefinitions, setPartDefinitions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8005/api/getPartDefinitions.php');
                if (Array.isArray(response.data)) {
                    console.log("Fetched part definitions:", response.data);
                    setPartDefinitions(response.data);
                } else {
                    console.error('Response is not an array:', response.data);
                    setPartDefinitions([]);
                }
            } catch (error) {
                console.error('Error fetching part definitions:', error);
                setPartDefinitions([]);
            }
        };

        fetchData();
    }, []);

    const handleChange = (event, value, reason) => {
        if (reason === 'selectOption' && value && value.part_number !== undefined) {
            // When a part number is selected from the Autocomplete options
            setFormData({
                ...formData,
                partNumber: value.part_number, // Ensure partNumber is updated based on selection
                partDefinitionsId: value.id  // Update partDefinitionsId as well
            });
        } else if (event.target.name && event.target.value !== undefined) {
            // For other input fields in the form
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let submitFormData = formData; // Default to current formData
    
        // Ensure formData.partNumber is up-to-date
        const currentSelection = partDefinitions.find(option => option.part_number === formData.partNumber);
        if (!currentSelection || formData.partDefinitionsId !== currentSelection.id) {
            // If there's a discrepancy or the partDefinitionsId doesn't match, prepare updated formData
            submitFormData = {
                ...formData,
                partNumber: currentSelection ? currentSelection.part_number : '',
                partDefinitionsId: currentSelection ? currentSelection.id : ''
            };
    
            // Optionally, update state here if necessary
            // setFormData(submitFormData); 
        }
    
        try {
            const response = await axios.post('http://localhost:8005/api/bookInHardware.php', submitFormData, {
                withCredentials: true
            });
    
            if (response.data && response.data.success) {
                alert("Success: " + response.data.success);
                setFormData({
                    ...formData,
                    quantity: '',
                    // Reset serialNumber and quantity to initial state if needed
                    partDefinitionsId: '' // Reset partDefinitionsId
                });
            } else if (response.data && response.data.error) {
                alert("Error: " + response.data.error);
            } else {
                alert("Unexpected response from the server. Please try again.");
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please check your network connection and try again.');
        }
    };

    return (
        <Layout>
            <h1 className="text-center font-semibold p-3 text-4xl">  {t("bookInPage.bookIn")}</h1>
            <div className="flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="w-full px-3 mb-6">
                        {Array.isArray(partDefinitions) && (
                            <Autocomplete
    freeSolo
    options={partDefinitions}
    getOptionLabel={(option) => option.part_number || ''}
    value={partDefinitions.find(option => option.part_number === formData.partNumber) || null} // Ensure the selected value is managed based on formData
    onChange={(event, value, reason) => handleChange(event, value, reason)}
    renderInput={(params) => (
        <BlueTextField
            {...params}
            label={t("common.part_number")}
            variant="outlined"
            name="partNumber"
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
    )}
/>
                        )}
                    </div>

                    <div className="w-full px-3 mb-6">
                        <BlueTextField
                            label="Quantity"
                            variant="outlined"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                            fullWidth
                            required 
                            sx={{
                                '& input': {
                                    color: 'black', // Custom text color
                                },
                                '& label': {
                                    color: 'black', // Custom label color
                                },
                                '&.Mui-focused input': {
                                    color: 'black', // Maintain text color on focus
                                },
                                '& label.Mui-focused': {
                                    color: 'black', // Maintain label color on focus
                                },
                                // Include other custom focus styles as needed
                            }}
                        />
                    </div>
                    {/* Serial Number Field Removed */}
                    <div className="flex justify-center mt-6">
                        <button
                            style={{ backgroundColor: '#a0f630', color: 'white', fontWeight: 'bold', padding: '8px 16px', borderRadius: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8ecf2d'} // Darker shade on hover
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#a0f630'} // Original color on mouse leave
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

export default BookInPage;
