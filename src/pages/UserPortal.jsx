import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import SearchDataTable from "../components/common/SearchDataTable";
import { fetchCustomers } from "../Axios";
import { useState, useEffect } from "react";

const UserPortal = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'email', headerName: 'Email', width: 130 },
        { field: 'phoneNumber', headerName: 'Phone', width: 130 },
    ];
    
    useEffect(() => {
        const loadCustomers = async () => { 
            try {
                setLoading(true);
                const data = await fetchCustomers();
                const rowData = data.data.rows;
                
                const formattedRows = rowData.map((row) => ({
                    id: row.id,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    email: row.email,
                    phoneNumber: row.phoneNumber,
                }));
                
                setRows(formattedRows);
            } catch (err) {
                console.error(err);
                setError("Failed to load customers data");
            } finally {
                setLoading(false);
            }
        };
        
        loadCustomers();
    }, []);
    
    return (
        <div>
            <Navbar/>
            <Sidebar/>
            <div style={{ padding: '20px' }}>
                {loading ? (
                    <p>Loading customer data...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <SearchDataTable rows={rows} columns={columns}/>
                )}
            </div>
        </div>
    );
}

export default UserPortal;