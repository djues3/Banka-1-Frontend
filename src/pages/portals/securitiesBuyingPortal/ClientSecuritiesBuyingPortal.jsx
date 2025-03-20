import {Container} from "@mui/material";
import SecuritiesTable from "../../../components/securititesBuyingComponents/SecuritiesTable";
import React from "react";

const ClientSecuritiesBuyingPortal = () =>{

    return(
        <Container sx={{ padding: "20px" }}>
            <SecuritiesTable role="client" />
        </Container>

    )
}
export default ClientSecuritiesBuyingPortal;