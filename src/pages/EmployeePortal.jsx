import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import SearchDataTable from "../components/common/SearchDataTable";
import { fetchEmployees, updateEmployeeStatus } from "../Axios";
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom styled switch for active/inactive status
const StatusSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#4caf50',
    '&:hover': {
      backgroundColor: '#4caf5014',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#4caf50',
  },
  '& .MuiSwitch-switchBase': {
    color: '#f44336',
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#f44336',
  },
}));

const EmployeePortal = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Setup columns including status toggle
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'phoneNumber', headerName: 'Phone', width: 150 },
        { field: 'position', headerName: 'Position', width: 150 },
        { field: 'department', headerName: 'Department', width: 150 },
        { 
            field: 'isAdmin', 
            headerName: 'Admin', 
            width: 80,
            renderCell: (params) => (
                <Checkbox checked={params.value} disabled />
            ),
        },
        {
            field: 'active',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <StatusSwitch
                    checked={params.value}
                    onChange={() => handleStatusToggle(params.row)}
                />
            ),
        },
    ];
    
    // Load employees on component mount
    useEffect(() => {
        loadEmployees();
    }, []);
    
    const loadEmployees = async () => {
        try {
            setLoading(true);
            const data = await fetchEmployees();
            const rowData = data.data.rows;
            
            const formattedRows = rowData.map((row) => ({
                id: row.id,
                firstName: row.firstName,
                lastName: row.lastName,
                phoneNumber: row.phoneNumber,
                position: row.position || 'N/A',
                department: row.department || 'N/A',
                isAdmin: row.isAdmin || false,
                active: row.active || false,
                // Store original data for update
                originalData: { ...row }
            }));
            
            setRows(formattedRows);
        } catch (err) {
            console.error(err);
            setError("Failed to load employees data");
        } finally {
            setLoading(false);
        }
    };
    
    // Handle toggle of active status
    const handleStatusToggle = async (row) => {
    try {
        // Ensure we have all the original data from the row
        console.log("Original row data:", row);
        
        // Create a clean employee object with all required fields
        const employeeData = {
            ...row.originalData,
            active: !row.active // Toggle the current status
        };
        
        const activeSwitch = {
            "active": employeeData.active
        }
        
        await updateEmployeeStatus(row.id, activeSwitch);
        
        // Update local state after successful API call
        setRows(prevRows =>
            prevRows.map(r =>
                r.id === row.id
                    ? { ...r, active: !r.active }
                    : r
            )
        );
        
        toast.success(`Employee ${row.firstName} ${row.lastName} status updated successfully`);
    } catch (error) {
        console.error("Error updating employee status:", error);
        toast.error(`Failed to update employee status: ${error.message}`);
    }
};
    
    return (
        <div>
            <Navbar/>
            <Sidebar/>
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h2>Employee Management</h2>
                {loading ? (
                    <p>Loading employee data...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <SearchDataTable 
                        rows={rows} 
                        columns={columns} 
                        checkboxSelection={false}
                    />
                )}
                <ToastContainer position="bottom-right" />
            </div>
        </div>
    );
};

export default EmployeePortal;