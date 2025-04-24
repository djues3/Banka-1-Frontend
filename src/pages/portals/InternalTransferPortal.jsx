import React from 'react';
import Sidebar from "../../components/mainComponents/Sidebar";
import InternalTransferForm from "../../components/transferComponents/InternalTransferForm";

const InternalTransferPortal = () => {

    return (
        <div>
            <Sidebar/>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <InternalTransferForm/>
            </div>

        </div>
    );
};

export default InternalTransferPortal;
