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
            style={{ backgroundColor: "red", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}
        >
            Reset Used Limit
        </button>
    );
};

export default ResetUsedLimitButton;
