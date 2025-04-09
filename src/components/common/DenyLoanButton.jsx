import React from "react";
import { denyLoan } from "../../services/AxiosBanking";
import { toast } from "react-toastify";

const DenyLoanButton = ({ loanId, onAction }) => {
    const handleDeny = async () => {
        try {
            const deniedLoan = {
                approved: false,
                reason: "Odbijen"
            };

            await denyLoan(loanId, deniedLoan);
            toast.success(`Loan ${loanId} declined successfully.`);
            onAction?.();
        } catch (error) {
            toast.error(`Error declining loan ${loanId}: ${error.message}`);
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleDeny}
            style={{
                backgroundColor: "#D32F2F",
                color: "#fff",
                padding: "8px 16px",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.9rem",
                transition: "background-color 0.3s",
            }}
        >
            Decline
        </button>
    );
};

export default DenyLoanButton;