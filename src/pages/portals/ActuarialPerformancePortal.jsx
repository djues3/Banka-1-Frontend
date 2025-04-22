import React, { useEffect, useState } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import SearchDataTable from "../../components/tables/SearchDataTable";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getActuarialProfits } from "../../services/AxiosTrading";

const ActuarialPerformancePortal = () => {
    const [actuaries, setActuaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadActuarialProfits();
    }, []);

    const loadActuarialProfits = async () => {
        try {
            setLoading(true);
            const response = await getActuarialProfits();

            const mappedActuaries = response.data.map((item, index) => ({
                id: index + 1,
                ...item
            }));

            setActuaries(mappedActuaries);
        } catch (err) {
            console.error(err);
            setError("Failed to load actuaries profit data");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { field: 'fullName', headerName: 'Full Name', width: 250 },
        { field: 'profit', headerName: 'Profit (RSD)', width: 180 },
        {
            field: 'role',
            headerName: 'Department',
            width: 150,
            renderCell: (params) => (
                params.value ? params.value.toUpperCase() : ''
            )        }
    ];

    return (
        <div>
            <Sidebar />
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h2>Actuarial Performance Portal</h2>
                {loading ? (
                    <p>Loading actuaries performance...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <SearchDataTable
                        rows={actuaries}
                        columns={columns}
                        checkboxSelection={false}
                        onRowClick={() => {}}
                    />
                )}
                <ToastContainer position="bottom-right" />
            </div>
        </div>
    );
};

export default ActuarialPerformancePortal;
