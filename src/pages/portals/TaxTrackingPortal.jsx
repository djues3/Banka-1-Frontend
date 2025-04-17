import React from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import TaxTrackingTable from "../../components/taxTrackingComponents/TaxTrackingTable";
import { Box, Typography } from "@mui/material";

const TaxTrackingPortal = () => {
    return (
        <div>
            <Sidebar />
            <Box
                sx={{
                    padding: "32px",
                    marginTop: "64px",
                    maxWidth: "1200px",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            >
                <h1 style={{fontSize: '2rem', fontWeight: 500, marginBottom: '16px'}}>
                    Tax Tracking
                </h1>
                <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                    Monitor tax payments for clients and actuaries
                </Typography>

                <TaxTrackingTable/>
            </Box>
        </div>
    );
};

export default TaxTrackingPortal;