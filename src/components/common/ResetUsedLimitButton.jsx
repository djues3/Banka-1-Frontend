import React from "react";
import { resetUsedLimit } from "../../services/AxiosTrading";
import { toast } from "react-toastify";

const ResetUsedLimitButton = ({ actuarId, onAction }) => {
    const handleReset = async () => {
        try {
            await resetUsedLimit(actuarId);
            toast.success(`Used limit for Actuar ${actuarId} reset successfully.`);
            onAction();
        } catch (error) {
            toast.error(`Error resetting limit for Actuar ${actuarId}: ${error.message}`);
        }
    };

    return (
        <button
            onClick={handleReset}
            style={{
                backgroundColor: "#D32F2F",
                color: "#fff",
                padding: "6px 14px",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.85rem",
                transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e06666")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#D32F2F")}
        >
            Reset Used Limit
        </button>
    );
};

export default ResetUsedLimitButton;