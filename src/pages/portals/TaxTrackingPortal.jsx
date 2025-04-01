import React from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import TaxTrackingTable from "../../components/taxTrackingComponents/TaxTrackingTable";

const TaxTrackingPortal = () =>{

    return(
        <div>
            <Sidebar/>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <TaxTrackingTable/>
            </div>

        </div>
    )
}
export default TaxTrackingPortal;