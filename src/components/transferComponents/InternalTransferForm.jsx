import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import {
    createInternalTransfer,
    createExchangeTransfer,
    verifyOTP,
    fetchAccountsForUser,
    previewExchangeTransfer
} from "../../services/AxiosBanking";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTheme } from "@mui/material/styles";

const InternalTransferForm = () => {
    const theme = useTheme();
    const [accounts, setAccounts] = useState([]);
    const [outflowAccount, setOutflowAccount] = useState('');
    const [inflowAccount, setInflowAccount] = useState('');
    const [outflowAccountNumber, setOutflowAccountNumber] = useState('');
    const [inflowAccountNumber, setInflowAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [modalStep, setModalStep] = useState('details');
    const [showModal, setShowModal] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const navigate = useNavigate();
    const [fromExchangeRate, setFromExchangeRate] = useState(1);
    const [toExchangeRate, setToExchangeRate] = useState(1);
    const [provision, setProvision] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);

    useEffect(() => {
        const getAccounts = async () => {
            try {
                const response = await fetchAccountsForUser();
                setAccounts(response);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };
        getAccounts();
    }, []);

    const selectedOutflow = accounts.find(acc => acc.id === outflowAccount);
    const selectedInflow = accounts.find(acc => acc.id === inflowAccount);
    const currency = selectedOutflow ? selectedOutflow.currencyType : '';
    const currency2 = selectedInflow ? selectedInflow.currencyType : '';
    const conversion = currency !== currency2;
    const filteredInflowAccounts = accounts.filter(account => account.id !== outflowAccount);

    const handleOutflowChange = (e) => {
        const selectedAccount = accounts.find(acc => acc.id === Number(e.target.value));
        setOutflowAccount(selectedAccount.id);
        setOutflowAccountNumber(selectedAccount.accountNumber);
        setInflowAccount('');
        setInflowAccountNumber('');
    };

    const handleInflowChange = (e) => {
        const selectedAccount = accounts.find(acc => acc.id === Number(e.target.value));
        setInflowAccount(selectedAccount.id);
        setInflowAccountNumber(selectedAccount.accountNumber);
    };

    const handleAmountChange = (e) => {
        let value = e.target.value.replace(',', '.');
        if (/^\d*\.?\d*$/.test(value)) setAmount(value);
    };

    const handleContinue = async () => {
        setShowModal(true);
        setModalStep('details');
        try {
            const response = await previewExchangeTransfer(currency, currency2, amount);
            if ("exchangeRate" in response) {
                if (currency === "RSD") {
                    setToExchangeRate(response.exchangeRate.toFixed(5));
                } else {
                    setFromExchangeRate(response.exchangeRate.toFixed(5));
                }
            } else {
                setFromExchangeRate(response.firstExchangeRate.toFixed(5));
                setToExchangeRate(response.secondExchangeRate.toFixed(5));
            }
            setProvision(response.provision);
            setFinalAmount(response.finalAmount);
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        }
    };

    const handleConfirmTransfer = async () => {
        try {
            let response;
            if (conversion) {
                response = await createExchangeTransfer({
                    accountFrom: outflowAccount,
                    accountTo: inflowAccount,
                    amount: parseFloat(amount)
                });
            } else {
                response = await createInternalTransfer({
                    fromAccountId: outflowAccount,
                    toAccountId: inflowAccount,
                    amount: parseFloat(amount)
                });
            }
            setTransactionId(response.data.transferId);
            setModalStep('verification');
        } catch (error) {
            console.error("Error during transfer:", error);
        }
    };

    const handleConfirmVerification = async () => {
        try {
            const response = await verifyOTP({
                transferId: transactionId,
                otpCode: verificationCode
            });
            if (response.status === 200) {
                toast.success("Transaction successfully verified!", { autoClose: 3000 });
                setShowModal(false);
                navigate('/customer-home');
            } else {
                toast.error("Invalid OTP.", { autoClose: 3000 });
            }
        } catch (error) {
            toast.error("Error verifying OTP.", { autoClose: 3000 });
        }
    };

    const onClose = () => {
        setShowModal(false);
        setVerificationCode("");
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '40px',
        }}>
            <Box sx={{
                width: '100%',
                maxWidth: '1600px',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: '16px',
                padding: '56px',
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 30px rgba(255, 255, 255, 0.08)'
                    : '0 8px 30px rgba(0, 0, 0, 0.1)',
            }}>
                <Typography variant="h4" textAlign="center" mb={4}>
                    New Internal Transfer
                </Typography>

                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        width: '100%',
                        alignItems: 'center'
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        fullWidth
                        id="outflow-account"
                        select
                        label="Outflow Account"
                        value={outflowAccount}
                        onChange={handleOutflowChange}
                        helperText="Please select your outflow account"
                    >
                        {accounts.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.accountNumber}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        id="inflow-account"
                        select
                        label="Inflow Account"
                        value={inflowAccount}
                        onChange={handleInflowChange}
                        helperText="Please select your inflow account"
                        disabled={!outflowAccount}
                    >
                        {filteredInflowAccounts.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.accountNumber}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        id="amount"
                        label={`Amount (${currency})`}
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        disabled={!outflowAccount}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleContinue}
                        disabled={!outflowAccount || !inflowAccount || !amount}
                        sx={{ mt: 2, width: '40%' }}
                    >
                        Continue
                    </Button>
                </Box>
            </Box>

            <Modal open={showModal} onClose={onClose}>
                <Box sx={{
                    p: 4,
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: 2,
                    boxShadow: 24,
                    width: 500,
                    margin: 'auto',
                    mt: '20vh'
                }}>
                    {modalStep === 'details' ? (
                        <>
                            <Typography variant="h6">Transfer Details</Typography>
                            <Typography><strong>From account:</strong> {outflowAccountNumber}</Typography>
                            <Typography><strong>Amount:</strong> {amount} {currency}</Typography>
                            <Typography><strong>To account:</strong> {inflowAccountNumber}</Typography>
                            <Typography><strong>Final Amount:</strong> {finalAmount.toFixed(3)}</Typography>
                            {currency !== 'RSD' && (
                                <Typography><strong>{currency} to RSD Rate:</strong> {fromExchangeRate}</Typography>
                            )}
                            {currency2 !== 'RSD' && (
                                <Typography><strong>{currency2} from RSD Rate:</strong> {toExchangeRate}</Typography>
                            )}
                            <Typography><strong>Provision:</strong> {provision.toFixed(3)}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button variant="outlined" onClick={onClose}>Cancel</Button>
                                <Button variant="contained" onClick={handleConfirmTransfer}>Continue</Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6">Enter Verification Code</Typography>
                            <TextField
                                label="Verification Code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                fullWidth
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Button variant="outlined" onClick={onClose}>Cancel</Button>
                                <Button variant="contained" onClick={handleConfirmVerification} disabled={!verificationCode}>
                                    Confirm
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default InternalTransferForm;