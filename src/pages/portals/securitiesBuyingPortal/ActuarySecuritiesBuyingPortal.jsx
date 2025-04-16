import {Container} from "@mui/material";
import SecuritiesTable from "../../../components/securititesBuyingComponents/SecuritiesTable";
import React from "react";
import Sidebar from "../../../components/mainComponents/Sidebar";

const ActuarySecuritiesBuyingPortal = () => {

    return(
        <Container sx={{ padding: "20px", marginTop: "64px" }}>
            <Sidebar />
            <h1>Actuary Securities Buying Portal</h1>
            <SecuritiesTable role="actuary" />
        </Container>

    )
}
export default ActuarySecuritiesBuyingPortal;