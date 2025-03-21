import {Container} from "@mui/material";
import SecuritiesTable from "../../../components/securititesBuyingComponents/SecuritiesTable";
import React from "react";
import Sidebar from "../../../components/mainComponents/Sidebar";

const ClientSecuritiesBuyingPortal = () =>{

    return(
        <Container sx={{ padding: "20px" }}>

            <Sidebar></Sidebar>
            Client Securities Buying Portal
            <SecuritiesTable role="client" />
        </Container>

    )
}
export default ClientSecuritiesBuyingPortal;