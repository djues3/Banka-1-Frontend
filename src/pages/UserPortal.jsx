import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import SearchDataTable from "../components/common/SearchDataTable";
import axios from "axios";
import { useState } from "react";

const UserPortal = () => {
    const [rows, setRows] = useState([]);

    const columns = [
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'phoneNumber', headerName: 'Phone', width: 130 },
    ];
      
    const handleFetch = (event) => {
        event.preventDefault();
        axios.get("http://localhost:8080/api/users/search/customers",{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response =>{
            const rowData = response.data.data.rows
    
            const formattedRows = rowData.map((row, index) => ({
                id: row.id,
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                phoneNumber: row.phoneNumber,
            }));
    
            setRows(formattedRows);
        })
        .catch(error=>{
            console.log(error);
            alert('Invalid email or password');
        })
    };
    
    return (
        <div>
            <Navbar/>
            <Sidebar/>
            <div style={{ padding: '20px' }}>
                <SearchDataTable rows={rows} columns={columns}/>
                <button onClick={handleFetch}>Press</button>
            </div>
        </div>
    )
}

export default UserPortal;