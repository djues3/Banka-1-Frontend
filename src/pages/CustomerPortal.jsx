import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import SearchDataTable from "../components/common/SearchDataTable";
import EditModal from "../components/common/EditModal";
import { fetchCustomers, fetchCustomerById, updateCustomer } from "../Axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerPortal = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

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

    const handleRowClick = async (row) => {
        try {
            const customerData = await fetchCustomerById(row.id);
            setSelectedCustomer(customerData);
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
        { name: 'username', label: 'Username', required: true },
        { name: 'email', label: 'Email', required: true, type: 'email' },
        { name: 'phoneNumber', label: 'Phone Number' },
        { name: 'address', label: 'Address' },
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
        { name: 'gender', label: 'Gender', type: 'select', options: [
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' }
        ] },
        { name: 'password', label: 'New Password', type: 'password' }
    ];
    
    return (
        <div>
            <Navbar/>
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