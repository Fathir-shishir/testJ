import { useContext } from 'react';
import 'moment/locale/de';


// MUI
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { LangContext } from '../utils/context/LangContext';
import { styled } from "@mui/material/styles";


const CustomDateTimePicker = styled(DatePicker)({
    "& input": {
        color: "white",
    },
    "& label": {
        color: "white",
    },
    "& .MuiSelect-select": {
        color: "white",
    },
    "& label.Mui-focused": { color: "white" },
    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": { borderColor: "#a0f630" },
        "&.Mui-focused fieldset": {
            borderColor: "#82e600",
        },
        "&.Mui-error:hover fieldset": {
            borderColor: "#f87171",
        },
        "&.Mui-error.Mui-focused fieldset": {
            borderColor: "red",
        },
    },
});


const BasicDateTimePicker = (props) => {
    const { Lang } = useContext(LangContext);

    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={Lang}>
            <CustomDateTimePicker {...props} />
        </LocalizationProvider>
    )
}

export default BasicDateTimePicker