import { Container } from "@mui/material";
import React from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import PublicSecuritiesTable from "../../components/securititesBuyingComponents/PublicSecuritiesTable";

const OtcTradingPortal = () => {
    return (
        <Container sx={{ padding: "20px" }}>
            <Sidebar />
            OTC Trading Portal
            <PublicSecuritiesTable />
        </Container>
    );
};

export default OtcTradingPortal;
