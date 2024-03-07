import React from 'react';
import { Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Pagination = ({ totalItems, itemsPerPage, currentPage, paginate, setItemsPerPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-between items-center mt-4">
            <div className="flex">
                {pageNumbers.map(number => (
                    <Button
                        key={number}
                        onClick={() => paginate(number)}
                        variant="contained"
                        color="primary"
                        className={`mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
                    >
                        {number}
                    </Button>
                ))}
            </div>

            <FormControl variant="outlined" className="ml-2">
                <InputLabel htmlFor="itemsPerPage">Items per page:</InputLabel>
                <Select
                    label="Items per page"
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(e.target.value);
                        paginate(1); // Reset to first page after changing the number of items per page
                    }}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

export default Pagination;
