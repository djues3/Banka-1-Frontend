import React, { useEffect, useState } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import SearchDataTable from "../../components/tables/SearchDataTable";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getActuarialProfits, getBankTotalProfit } from "../../services/AxiosTrading";

import { Grid, Card, CardContent, Typography } from "@mui/material";

const ActuarialPerformancePortal = () => {
    const [actuaries, setActuaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bankProfit, setBankProfit] = useState(null);
    const [isRouteActive, setIsRouteActive] = useState(true);

    useEffect(() => {
        loadActuarialProfits();
        loadBankProfit();
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

    const loadBankProfit = async () => {
        try {
            const response = await getBankTotalProfit();
            setBankProfit(response.total);
            setIsRouteActive(true);
        } catch (err) {
            console.error(err);
            setIsRouteActive(false);
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
            )
        }
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
                    <>
                        <SearchDataTable
                            rows={actuaries}
                            columns={columns}
                            checkboxSelection={false}
                            onRowClick={() => {}}
                        />

                        <Typography variant="h6" align="center" sx={{ mt: 5, mb: 2 }}>
                            Bank Performance Summary
                        </Typography>

                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={6} md={4}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: 110,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Bank Profit (RSD)
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                                            {isRouteActive && bankProfit !== null
                                                ? bankProfit.toLocaleString('sr-RS') + ' RSD'
                                                : 'Coming Soon'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}
                <ToastContainer position="bottom-right" />
            </div>
        </div>
    );
};

export default ActuarialPerformancePortal;

