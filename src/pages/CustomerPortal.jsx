import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import SearchDataTable from "../components/common/SearchDataTable";
import EditModal from "../components/common/EditModal";
import { fetchCustomers, fetchCustomerById, updateCustomer } from "../Axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { Button } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';

const CustomerPortal = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phoneNumber', headerName: 'Phone', width: 150 },
    ];
    
    useEffect(() => {
        loadCustomers();
    }, []);
    
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

    const formatLogDate = (log) => {
        if (typeof log !== "string" && typeof log !== "number") return String(log);
      
        const strLog = String(log);
        
        if (strLog.length === 8) {
          // Extract year, month, and day
          const year = strLog.slice(0, 4);
          const month = strLog.slice(4, 6);
          const day = strLog.slice(6, 8);
          
          return `${year}-${month}-${day}`; // Output format: YYYY-MM-DD
        }
      
        return strLog; // Return as-is if not in expected format
      };

    const handleRowClick = async (row) => {
        try {
            const response = await fetchCustomerById(row.id);
            
            const customerData = response.data || response;
           
            // Create a clean customer object
            const cleanCustomerData = {
                id: row.id,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                username: customerData.username,
                email: customerData.email,
                phoneNumber: customerData.phoneNumber,
                address: customerData.address,
                birthDate: formatLogDate(customerData.birthDate),
                gender: customerData.gender
            };

            setSelectedCustomer(cleanCustomerData);
            setIsEditModalOpen(true);
        } catch (error) {
            toast.error(`Error fetching customer details: ${error.message}`);
        }
    };

    const handleSaveCustomer = async (updatedCustomerData) => {
        try {
            // Map to the expected API format
            const customerPayload = {
                ime: updatedCustomerData.firstName,
                prezime: updatedCustomerData.lastName,
                username: updatedCustomerData.username,
                datum_rodjenja: updatedCustomerData.birthDate,
                pol: updatedCustomerData.gender,
                email: updatedCustomerData.email,
                broj_telefona: updatedCustomerData.phoneNumber,
                adresa: updatedCustomerData.address,
                // Only include password if it's provided in the form
                ...(updatedCustomerData.password && { password: updatedCustomerData.password })
            };

            await updateCustomer(updatedCustomerData.id, customerPayload);
            setIsEditModalOpen(false);
            toast.success('Customer updated successfully');
            loadCustomers(); // Reload the data to reflect changes
        } catch (error) {
            toast.error(`Failed to update customer: ${error.message}`);
        }
    };

    const customerFormFields = [
        { name: 'firstName', label: 'First Name', required: true },
        { name: 'lastName', label: 'Last Name', required: true },
        // { name: 'username', label: 'Username', required: true },
        { name: 'email', label: 'Email', required: true, type: 'email' },
        { name: 'phoneNumber', label: 'Phone Number' },
        { name: 'address', label: 'Address' },
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
        { name: 'gender', label: 'Gender', type: 'select', options: [
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' }
        ] },
    ];
    
    return (
        <div>
            <Sidebar/>
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h2>Customer Management</h2>
                {loading ? (
                    <p>Loading customer data...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <SearchDataTable 
                        rows={rows} 
                        columns={columns} 
                        checkboxSelection={false}
                        onRowClick={handleRowClick}
                    />
                        
                )}

                {selectedCustomer && (
                    <EditModal
                        open={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        data={selectedCustomer}
                        formFields={customerFormFields}
                        onSave={handleSaveCustomer}
                        title="Edit Customer"
                    />
                )}

                <ToastContainer position="bottom-right" />
            </div>
        </div>
    );
}

export default CustomerPortal;