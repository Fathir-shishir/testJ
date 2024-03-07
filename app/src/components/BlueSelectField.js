import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomFormControl = styled(FormControl)({
    // Add your custom styles here, similar to what you have in BlueTextField
    "& label": {
        color: "#f7f5f5", // Adjust the color as per your theme
    },
    "& .MuiSelect-select": {
        color: "#f7f5f5", // Text color for the select dropdown
    },
    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
            borderColor: "#a0f630", // Border color on hover
        },
        "&.Mui-focused fieldset": {
            borderColor: "#82e600", // Border color when the field is focused
        },
    },
    // Add any additional styling you need here
});

const BlueSelectField = ({ label, value, onChange, options }) => {
    return (
        <CustomFormControl variant="outlined" fullWidth>
            <InputLabel style={{ color: "#f7f5f5" }}>{label}</InputLabel>
            <Select
                value={value}
                onChange={onChange}
                label={label}
                style={{ color: "#f7f5f5" }} // Text color for the selected item
            >
                {options.map((option, index) => (
                    <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                ))}
            </Select>
        </CustomFormControl>
    );
}

export default BlueSelectField;
