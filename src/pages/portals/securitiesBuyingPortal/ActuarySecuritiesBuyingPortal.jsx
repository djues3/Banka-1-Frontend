import {Container} from "@mui/material";
import SecuritiesTable from "../../../components/securititesBuyingComponents/SecuritiesTable";
import React from "react";

const ActuarySecuritiesBuyingPortal = () => {

    return(
        <Container sx={{ padding: "20px" }}>
            <SecuritiesTable role="actuary" />
        </Container>

    )
}
export default ActuarySecuritiesBuyingPortal;