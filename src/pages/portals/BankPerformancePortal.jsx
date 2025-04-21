import React, { useEffect, useState } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import SearchDataTable from "../../components/tables/SearchDataTable";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBankProfits } from "../../services/AxiosTrading";

const BankPerformancePortal = () => {
    const [profits, setProfits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadBankProfits();
    }, []);

    const loadBankProfits = async () => {
        try {
            setLoading(true);
            const response = await getBankProfits();
            setProfits(response.data);
        } catch (err) {
            setError("Failed to load bank profit data");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { field: 'year', headerName: 'Year', width: 120 },
        { field: 'month', headerName: 'Month', width: 120 },
        { field: 'actuary_profit', headerName: 'Actuary Profit (RSD)', width: 180 },
        { field: 'fees', headerName: 'Fees (RSD)', width: 120 },
        { field: 'total', headerName: 'Total (RSD)', width: 180 }
    ];

    return (
        <div>
            <Sidebar />
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h2>Bank Performance Portal</h2>
                {loading ? (
                    <p>Loading bank performance data...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <SearchDataTable
                        rows={profits}
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

export default BankPerformancePortal;
