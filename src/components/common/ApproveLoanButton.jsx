import React from "react";
import { approveLoan } from "../../services/AxiosBanking";
import { toast } from "react-toastify";

const ApproveLoanButton = ({ loanId, onAction }) => {
    const handleApprove = async () => {
        try {
            const approvedLoan = {
                approved: true,
                reason: "Odobren"
            };

            await approveLoan(loanId, approvedLoan);
            toast.success(`Loan ${loanId} approved successfully.`);
            onAction?.();
        } catch (error) {
            toast.error(`Error approving loan ${loanId}: ${error.message}`);
            console.error(error);
        }
    };

    return (
        <button
            onClick={handleApprove}
            style={{
                backgroundColor: "#4CAF50",
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
            Approve
        </button>
    );
};

export default ApproveLoanButton;