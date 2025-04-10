import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Grid,
    Link
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import AccountNameChangeModal from "./AccountNameChangeModal";
import AccountLimitChangeModal from "./AccountLimitChangeModal";

const AccountDetailsModal = ({ open, onClose, account }) => {
    const theme = useTheme();
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
                Account Details
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Account number"
                            value={account?.accountNumber || ""}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Account owner"
                            value={account?.owner || ""}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Type"
                            value={`${account?.type}` || ""}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Limit"
                            value={`${account?.dailyLimit} RSD`}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Reserved"
                            value={`${account?.reservedBalance} RSD`}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Balance"
                            value={`${account?.balance} RSD`}
                            disabled
                        />
                    </Grid>
                </Grid>

                {/* Linkovi */}
                <Grid container spacing={2} mt={3}>
                    <Grid item xs={6}>
                        <Link
                            onClick={() => setIsLimitModalOpen(true)}
                            sx={{
                                color: theme.palette.primary.main,
                                textDecoration: "none",
                                fontSize: "0.9rem",
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" }
                            }}
                        >
                            Limit Change
                        </Link>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: "bold"
                    }}
                >
                    BACK
                </Button>
            </DialogActions>

            {/* Modali */}
            <AccountNameChangeModal
                open={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
                account={account}
                onSave={(updatedAccount) => {
                    console.log("Updated name:", updatedAccount);
                    setIsNameModalOpen(false);
                }}
            />

            <AccountLimitChangeModal
                open={isLimitModalOpen}
                onClose={() => setIsLimitModalOpen(false)}
                account={account}
                onSave={(updatedAccount) => {
                    console.log("Updated limit:", updatedAccount);
                    setIsLimitModalOpen(false);
                }}
            />
        </Dialog>
    );
};

export default AccountDetailsModal;