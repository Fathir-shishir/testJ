import React, { useState } from 'react';
import TableFunctions from './TableFunctions'; // Import TableFunctions for handling actions
import BlueTextField from '../components/BlueTextField'; // Custom styled TextField
import BasicDateTimePicker from './BasicDateTimePicker';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import DatePickerExample from './DatePickerExample'; 

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    InputAdornment,
    Button
} from '@mui/material';

const BookedInTable = ({ data }) => {
    const navigate = useNavigate();
    const [activeItemId, setActiveItemId] = useState(null); // State to track the active item ID
    // Define state for each filter
    const [searchDateRange, setSearchDateRange] = useState({ from_date: null, to_date: null });
    const [searchPartNumber, setSearchPartNumber] = useState('');
    const [searchSerialNumber, setSearchSerialNumber] = useState('');
    const [searchCreatedAt, setSearchCreatedAt] = useState(null);
    const [searchCurrentStatus, setSearchCurrentStatus] = useState('');
    const [hoveredRow, setHoveredRow] = useState(null); 

    const statusOptions = ["In", "Out"];

    const filterData = (
        data,
        searchPartNumber,
        searchSerialNumber,
        searchCreatedAt,
        searchCurrentStatus,
    ) => {
        return data.filter(item => {
            const matchesPartNumber = item.bh_partNumber.toLowerCase().includes(searchPartNumber.toLowerCase());
            const matchesSerialNumber = searchSerialNumber === '' ? true : item.bh_serialNumber ? item.bh_serialNumber.toLowerCase().includes(searchSerialNumber.toLowerCase()) : false;
            const matchesCurrentStatus = item.bh_currentStatus?.toLowerCase().includes(searchCurrentStatus.toLowerCase());

            let matchesDateRange = true;
            if (searchDateRange.from_date && searchDateRange.to_date && item.bh_created_at && item.bh_created_at.date) {
                const itemDate = new Date(item.bh_created_at.date);
                const fromDate = new Date(searchDateRange.from_date);
                const toDate = new Date(searchDateRange.to_date);
                matchesDateRange = itemDate >= fromDate && itemDate <= toDate;
            }

            return matchesPartNumber && matchesSerialNumber && matchesCurrentStatus && matchesDateRange;
        });
    };

    
    const handleDetails = (id, event) => {
        console.log(id)
        event.stopPropagation();
        navigate(`/details/${id}`);
    };

    const handleResetDate = () => {
        setSearchCreatedAt(null);
    };

    const filteredData = filterData(data, searchPartNumber, searchSerialNumber, searchCreatedAt, searchCurrentStatus);



    return (
        <TableContainer component={Paper} className="my-2">
            <Table className="w-full">
                <TableHead className="bg-valeo-blue text-[#f7f5f5]">
                <TableRow 
 
                        >
                        {/* Table Head Cells for Filters */}
                        {/* Update or add more filters based on your data */}
                        <TableCell>
                            <BlueTextField 
                                label="Part Number"
                                value={searchPartNumber}
                                onChange={(e) => setSearchPartNumber(e.target.value)}
                            />
                        </TableCell>
                        <TableCell>
                            <BlueTextField 
                                label="Serial Number"
                                value={searchSerialNumber}
                                onChange={(e) => setSearchSerialNumber(e.target.value)}
                            />
                        </TableCell>
                        <TableCell style={{ color: "white" }}>
     
     Quantity
        
        

</TableCell>
<TableCell>
        <DatePickerExample
            selected={searchDateRange}
            onChange={(update) => setSearchDateRange(update)}
        />
        {/* Make sure DatePickerExample is adapted to handle this structure and functionality */}
    </TableCell>
                        <TableCell>
                            <Autocomplete
                                options={statusOptions}
                                getOptionLabel={(option) => option}
                                renderInput={(params) => (
                                    <BlueTextField 
                                        {...params} 
                                        label="Status" 
                                        value={searchCurrentStatus}
                                        onChange={(e) => setSearchCurrentStatus(e.target.value)}
                                    />
                                )}
                                value={searchCurrentStatus}
                                onInputChange={(event, newInputValue) => {
                                    setSearchCurrentStatus(newInputValue);
                                }}
                            />
                        </TableCell>
                        <TableCell style={{ color: "white" }}>
                        Price (€)
                        </TableCell>
                        <TableCell>
                            
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredData.reverse().map((item, index) => (
         <TableRow 
         key={item.bh_id} 
         hover
         onMouseEnter={() => setHoveredRow(index)} // Set hovered row
         onMouseLeave={() => setHoveredRow(null)} // Reset hovered row
     >
                          
                            <TableCell  >{item.bh_partNumber}</TableCell>
                            <TableCell  >{item.bh_serialNumber}</TableCell>
                            <TableCell  >{item.bh_quantity.trim()}</TableCell>
                            <TableCell  > {new Date(item.bh_created_at.date).toLocaleString()}</TableCell>
                            <TableCell  >{item.bh_currentStatus}</TableCell>
                            <TableCell>€{item.pd_price != null ? item.pd_price.toFixed(2) : '0'}</TableCell>

                            <TableCell className="text-center">
                            <HistoryIcon 
    style={{ 
        color: '#164863', 
        visibility: hoveredRow === index ? 'visible' : 'hidden'
    }}
    onClick={(event) => handleDetails(item.bh_id, event)}
/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BookedInTable;
