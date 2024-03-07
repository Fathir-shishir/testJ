const { useState, useEffect } = require("react")

const useItems= ()=>{
    const [data, setData] = useState([]);
    useEffect(()=>{
        fetch('http://localhost:8005/api/BookedHardware.php?status=All')
        .then(res=>res.json())
        .then(data=>setData(data))
    },[])
    return[data,setData]
}

export default useItems