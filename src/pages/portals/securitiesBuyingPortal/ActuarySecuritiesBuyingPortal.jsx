import {Container} from "@mui/material";
import SecuritiesTable from "../../../components/securititesBuyingComponents/SecuritiesTable";
import React from "react";
import Sidebar from "../../../components/mainComponents/Sidebar";

const ActuarySecuritiesBuyingPortal = () => {

    return(
        <Container sx={{ padding: "20px" }}>

            <Sidebar></Sidebar>
            Client Securities Buying Portal
            <SecuritiesTable role="actuary" />
        </Container>

    )
}
export default ActuarySecuritiesBuyingPortal;