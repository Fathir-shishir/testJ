const filterData = (data, searchTerm, searchType) => {
    if (!searchTerm) return data;

    return data.filter(item => {
        if (searchType === 'id') {
            return item.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'name') {
            return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'type') {
            // Assuming 'type' is a property of your data items
            // Adjust the property name as per your data structure
            return item.type.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });
};

export default filterData;
