import { Container, Typography } from "@mui/material";
import SecuritiesTable from "../../../components/securititesBuyingComponents/SecuritiesTable";
import React from "react";
import Sidebar from "../../../components/mainComponents/Sidebar";

const ClientSecuritiesBuyingPortal = () => {
    return (
        <Container sx={{ pt: "80px", px: "20px" }}>
            <Sidebar />

            <Typography variant="h4" gutterBottom>
                Client Securities Buying Portal
            </Typography>

            <SecuritiesTable role="client" />
        </Container>
    );
};

export default ClientSecuritiesBuyingPortal