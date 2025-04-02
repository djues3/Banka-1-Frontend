import React, { useState, useEffect } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import SearchDataTable from "../../components/tables/SearchDataTable";
import {getCompanies} from "../../services/AxiosBanking"
import { fetchCustomers } from "../../services/AxiosUser";
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

            const companiesRes = await getCompanies();
            const customersRes = await fetchCustomers();

            const customersMap = {};
            customersRes.data.rows.forEach(customer => {
                const fullName = `${customer.firstName} ${customer.lastName}`;
                customersMap[customer.id] = fullName;
            });
            

            const mappedCompanies = companiesRes.data.companies.map(company => ({
                id: company.id,
                name: company.name,
                companyNumber: company.companyNumber,
                vatNumber: company.vatNumber,
                bas: company.bas,
                address: company.address,
                owner: customersMap[company.ownerID] || `ID: ${company.ownerID}`
            }));

            setCompanies(mappedCompanies);
        } catch (err) {
            console.error(err);
            setError("Failed to load companies or customers");
        } finally {
            setLoading(false);
        }
    };







    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'name', headerName: 'Company Name', width: 170 },
        { field: 'companyNumber', headerName: 'Company Registration Number', width: 250 },
        { field: 'vatNumber', headerName: 'VAT Number', width: 130 },
        { field: 'bas', headerName: 'Business Activity Code', width: 170 },
        { field: 'address', headerName: 'Address', width: 200 },
        { field: 'owner', headerName: 'Owner', width: 200 }
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
