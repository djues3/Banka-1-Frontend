import React, { useState, useEffect } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import SearchDataTable from "../../components/tables/SearchDataTable";
import {getCompanies} from "../../services/AxiosBanking"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CompaniesPortal = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const data = await getCompanies();
            setCompanies(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load comanies data");
        } finally {
            setLoading(false);
        }
    };


    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'companyName', headerName: 'Company Name', width: 200 },
        { field: 'companyRegistrationNumber', headerName: 'Company Registration Number ', width: 200 },
        { field: 'pib', headerName: 'PIB', width: 150 },
        { field: 'businessActivityCode', headerName: ' Business Activity Code', width: 120 },
        { field: 'address', headerName: 'Address', width: 120 },
        { field: 'owner', headerName: 'Owner', width: 120 },
    ];

    return (
        <div>
            <Sidebar />
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h2>Companies Portal</h2>
                {loading ? (
                    <p>Loading companies...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (

                    <SearchDataTable
                        rows={companies}
                        columns={columns}
                        checkboxSelection={false}
                    />
                )}
                <ToastContainer position="bottom-right" />
            </div>
        </div>
    );
};

export default CompaniesPortal;
