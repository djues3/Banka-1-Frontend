import React, { useState, useEffect } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import SearchDataTable from "../../components/tables/SearchDataTable";
import EditModal from "../../components/common/EditModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getActuaries, getActuaryById, updateActuaryLimit, resetUsedLimit } from "../../services/AxiosTrading";
import ResetUsedLimitButton from "../../components/common/ResetUsedLimitButton";

const ActuarialManagementPortal = () => {
    const [actuaries, setActuaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedActuar, setSelectedActuar] = useState(null);

    useEffect (() => {
         loadActuaries();
    }, []);

    const loadActuaries = async () => {
        try {
            setLoading(true);
            const data = await getActuaries();
            setActuaries(data.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load actuaries data");
        } finally {
            setLoading(false);
        }
    };

    const handleRowClick = (row) => {
        setSelectedActuar(row);
        setIsEditModalOpen(true);
    };

    const handleSaveActuar = async (updatedActuar) => {
        try {
            await updateActuaryLimit(updatedActuar.id, updatedActuar.limit);
            setIsEditModalOpen(false);
            loadActuaries();
            toast.success('Actuar limit updated successfully');
        } catch (error) {
            toast.error(`Failed to update actuar: ${error.message}`);
        }
    };

    const handleResetUsedLimit = async (actuarId) => {
        try {
            await resetUsedLimit(actuarId);
            loadActuaries();
            toast.success('Used limit reset successfully');
        } catch (error) {
            toast.error(`Failed to reset limit: ${error.message}`);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'fullName', headerName: 'Full Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 150 },
        { field: 'limit', headerName: 'Limit', width: 120 },
        { field: 'usedLimit', headerName: 'Used Limit', width: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <ResetUsedLimitButton actuarId={params.row.id} onAction={() => handleResetUsedLimit(params.row.id)} />
            )
        }
    ];

    return (
        <div>
            <Sidebar />
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h2>Actuarial Management Portal</h2>
                {loading ? (
                    <p>Loading actuaries...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <SearchDataTable
                        rows={actuaries}
                        columns={columns}
                        checkboxSelection={false}
                        onRowClick={handleRowClick}
                    />
                )}
                {selectedActuar && (
                    <EditModal
                        open={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        data={selectedActuar}
                        formFields={[{ name: 'limit', label: 'Limit', required: true, type: 'number' }]}
                        onSave={handleSaveActuar}
                        title="Edit Actuar Limit"
                    />
                )}
                <ToastContainer position="bottom-right" />
            </div>
        </div>
    );
};

export default ActuarialManagementPortal;
