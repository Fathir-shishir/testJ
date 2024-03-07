import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSession } from "../globalStates/session.state";

const TableFunctions = ({ setCurrentPage, setDropdownOpen, dropdownOpen }) => {
    const navigate = useNavigate();
    const [sessionState] = useSession();


    const handleDetails = (id, event) => {
        event.stopPropagation();
        navigate(`/details/${id}`);
    };

    const handleDropdown = (id) => {
        setDropdownOpen(dropdownOpen === id ? null : id);
    };

    const handleBookOut = async (id) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };
    
            const response = await fetch('http://localhost:8005/api/SwitchCurrentStatus.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if(response.status === 200) {
                const historyData = {
                    "ItemID": parseInt(id, 10),
                    "UserName": sessionState.name,
                    "Status": "BookedOut"
                };
    
                const historyResponse = await axios.post(
                    'http://localhost:8005/api/saveHistory.php',
                    historyData,
                    { headers }
                );
        
                if(historyResponse.status === 200) {
                    alert('Item and history updated successfully!');
                } else {
                    alert('Item updated but failed to save history. ' + historyResponse.data.error);
                }
            } else {
                alert('Failed to update item. ' + response.data.error);
            }

            const data = await response.json();
            if (data.success) {
                alert('Status updated successfully!');
                // Optional: Refresh data here
            } else {
                console.error('Failed to update status:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return {  handleDetails, handleDropdown, handleBookOut };
};

export default TableFunctions;
