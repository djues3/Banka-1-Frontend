import React, {useEffect, useState} from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {toast} from "react-toastify";
import {MenuItem, Select, Typography} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import {fetchAccountsForUser} from "../../services/AxiosBanking";


function SellModal({ isOpen, onClose, onSave, selectedSecurity }) {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const [amount, setAmount] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [accounts, setAccounts] = useState([])
    const [selectedAccount, setSelectedAccount] = useState("");

    const loadAccounts = async () => {
        try {

            const fetchedAccounts = await fetchAccountsForUser(userId);
            console.log("Fetched accounts:", fetchedAccounts);
            if (fetchedAccounts && Array.isArray(fetchedAccounts)) {


                setAccounts(fetchedAccounts);
            } else {
                console.error("API response does not contain accounts array:", fetchedAccounts);
                setAccounts([]);
            }
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
        }
    };


    useEffect(() => {
        if(isOpen){
            loadAccounts();
        }
    }, [isOpen]);



    const handleSell = () =>{
        if(amount > selectedSecurity.amount || amount <= 0){
            toast.error("Insufficient number of securities.")
        }else{
            setConfirmOpen(true);
        }

    }
    const confirmSell = () => {
        onSave(Number(amount),selectedAccount, userId, selectedSecurity);
        setAmount(0);
        setConfirmOpen(false);
        onClose();
    };

    const cancelConfirm = () => {
        setConfirmOpen(false);
    };


    return (
        <>
            <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedSecurity.type} {selectedSecurity.ticker}</DialogTitle>



                <DialogContent>




                    <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                        Available securities: {selectedSecurity.amount}
                    </Typography>

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Amount to Sell"
                        type="number"
                        fullWidth
                        value={amount===0?"" : amount}
                        onChange={(e) => setAmount(e.target.value)}
                        variant="outlined"
                    />

                    <TextField
                        id="accounts"
                        select
                        label="Select an account"
                        value={selectedAccount || ""}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        variant="standard"
                        fullWidth
                        margin="dense"
                        sx={{ mt: 1, mb: 2 }}
                    >
                        {accounts.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.accountNumber}
                            </MenuItem>
                        ))}
                    </TextField>





                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleSell} color="primary" variant="contained">
                        Sell
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={cancelConfirm}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <Typography>
                        You are about to sell <strong>{amount}</strong> securities.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelConfirm} color="secondary" variant="outlined">
                        No
                    </Button>
                    <Button onClick={confirmSell} color="primary" variant="contained">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default SellModal;
