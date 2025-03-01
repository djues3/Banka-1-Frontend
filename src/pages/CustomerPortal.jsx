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

    // Load the customer data on component mount when the page loads
    useEffect(() => {
        loadCustomers();
    }, []);
    // Load the customer data from the API
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
    // Format the date in the log to YYYY-MM-DD
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

    // Handle the row click event to open the edit modal with the customer data pre-filled in the form fields
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
            // Set the selected customer data and open the edit modal with the data pre-filled in the form fields
            setSelectedCustomer(cleanCustomerData);
            setIsEditModalOpen(true);
        } catch (error) {
            toast.error(`Error fetching customer details: ${error.message}`);
        }
    };

    // Handle the save event when the user clicks the save button in the edit modal formm
    const handleSaveCustomer = async (updatedCustomerData) => {
        try {
            // Map to the expected API format and update the customer data
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
            // Update the customer data and show a success message
            await updateCustomer(updatedCustomerData.id, customerPayload);
            setIsEditModalOpen(false);
            toast.success('Customer updated successfully');
            loadCustomers(); // Reload the data to reflect changes
        } catch (error) {
            toast.error(`Failed to update customer: ${error.message}`);
        }
    };
    // Define the form fields for the customer form in the edit modal
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
            <Navbar/>
            <Sidebar/>
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h2>Customer Management</h2>
                {/* Loading view while fetching data */}
                {loading ? (
                    <p>Loading customer data...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    // Display the customer data in a table
                    <SearchDataTable 
                        rows={rows} 
                        columns={columns} 
                        checkboxSelection={false}
                        onRowClick={handleRowClick}
                    />
                        
                )}
                {/*  // Edit modal   */}
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