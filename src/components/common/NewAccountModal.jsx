import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

const NewAccountModal = ({ open, onClose, onContinue }) => {
    const [account, setAccount] = useState('');
    const [accountType, setAccountType] = useState('');

    // Possible values
    const accountTypeOptions = {
        current: [
            { value: 'standard', label: 'Standard' },
            { value: 'savings', label: 'Savings' },
            { value: 'pension', label: 'Pension' },
            { value: 'student', label: 'Student' },
            { value: 'youth', label: 'Youth' },
            { value: 'personal', label: 'Personal' },
            { value: 'business', label: 'Business' },
        ],
        foreign: [
            { value: 'personal', label: 'Personal' },
            { value: 'business', label: 'Business' },
        ],
    };

    const handleAccountChange = (e) => {
        setAccount(e.target.value);
        setAccountType(''); // reset account type when changing account
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Creating a new account</DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                    Choose the account you want to create
                </Typography>

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="account-label">Account</InputLabel>
                    <Select
                        labelId="account-label"
                        id="account"
                        value={account}
                        onChange={handleAccountChange}
                        label="Account"
                    >
                        <MenuItem value="">
                            <em>Choose account</em>
                        </MenuItem>
                        <MenuItem value="current">Current</MenuItem>
                        <MenuItem value="foreign">Foreign Currency</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                    Choose the type of account you want to create
                </Typography>

                <FormControl fullWidth sx={{ mt: 2 }} disabled={!account}>
                    <InputLabel
                        id="account-type-label"
                        shrink={!!accountType || account !== ''}
                    >
                        Account type
                    </InputLabel>
                    <Select
                        labelId="account-type-label"
                        id="account-type"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        label="Account type"
                        notched={!!accountType}
                    >
                        <MenuItem value="">
                            <em>Choose account type</em>
                        </MenuItem>

                        {account &&
                            accountTypeOptions[account].map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (!account || !accountType) {
                            console.log("Please select both account and type");
                            return;
                        }
                        onContinue(account, accountType);
                    }}
                    disabled={!account || !accountType}
                >
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewAccountModal;
