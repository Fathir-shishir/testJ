// BlueTextField.js
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

// Adjusted to accept customStyles prop
const CustomTextField = styled(TextField)(({ theme, customStyles }) => ({
    "& input": {
        color: "#f7f5f5",
    },
    "& label": {
        color: "#f7f5f5",
    },
    "& .MuiSelect-select": {
        color: "#f7f5f5",
    },
    "& label.Mui-focused": {
        color: "#f7f5f5",
    },
    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
            borderColor: "#a0f630",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#82e600",
        },
    },
    ...customStyles, // Spread custom styles here
}));

const BlueTextField = ({ sx, ...props }) => {
    return <CustomTextField customStyles={sx} {...props} />
}

export default BlueTextField;
