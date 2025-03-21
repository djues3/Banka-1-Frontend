import React, { useEffect, useState } from 'react';
import styles from '../../styles/ReceiversModal.module.css';
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

function RecipientModal({ isOpen, onClose, data, onSave, title }) {
    const [formData, setFormData] = useState({
        id: null,
        fullName: "",
        accountNumber: "",
        address: ""
    });

    const [errors, setErrors] = useState({
        fullName: "",
        accountNumber: "",
    });

    useEffect(() => {
        if (isOpen) {
            console.log("Modal received recipient data:", data);

            setFormData({
                id: data?.id || null,
                fullName: data?.fullName || "",
                accountNumber: data?.accountNumber || "",
                address: ""
            });
            setErrors({});
        }
    }, [isOpen, data]);

    if (!isOpen) return null;

    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains(styles.modal)) {
            setErrors({});
            onClose();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Sending recipient data from modal:", formData);

        let validationErrors = {};
        if (!formData.fullName.trim()) {
            validationErrors.fullName = "Recipient name is required.";
        }
        if (!formData.accountNumber.trim()) {
            validationErrors.accountNumber = "Account number is required.";
        }

        console.log(errors)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            label={"Recipient Name:"}
                            name={"Recipient Name"}
                            type={'text'}
                            value={formData.fullName || ''}
                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}

                        />
                        {errors.fullName && <p className={styles.error}>{errors.fullName}</p>}
                    </div>


                    <div className={styles.inputContainer}>

                        <TextField
                            fullWidth
                            label={"Account Number:"}
                            name={"Account Number"}
                            type={'text'}
                            value={formData.accountNumber || ''}
                            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                        />
                        {errors.accountNumber && <p className={styles.error}>{errors.accountNumber}</p>}
                    </div>

                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained">Save</Button>
                    </DialogActions>

                </form>
            </DialogContent>

        </Dialog>
    );
}

export default RecipientModal;