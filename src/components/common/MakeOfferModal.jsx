import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography
} from "@mui/material";
import { createOffer } from "../../services/AxiosTrading";
import {toast} from "react-toastify";

const MakeOfferModal = ({ open, onClose, security }) => {
    const portfolioId = security?.portfolioId;
    const [quantity, setQuantity] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState("");
    const [settlementDate, setSettlementDate] = useState("");

    useEffect(() => {
        if (open) {
            setQuantity("");
            setPricePerUnit("");
            setSettlementDate("");
        }
    }, [open]);

    const handleMakeOffer = async () => {

        if(quantity > security.public || quantity <= 0){
            toast.error("Insufficient quantity")
            return;
        }

        console.log(security)

        const payload = {
            portfolio_id: portfolioId,
            quantity: parseInt(quantity),
            price_per_unit: parseFloat(pricePerUnit),
            premium: 100.0,
            settlement_date: settlementDate
        };

        try {
            const response = await createOffer(payload);
            toast.success("Offer successfull")
            console.log("Uspešno poslata ponuda:", response.data);
            onClose();
        } catch (error) {
            console.error("Greška pri slanju ponude:", error);
            toast.error("Error while making offer")
            // alert("Greška pri slanju ponude.");
        }
    };

    const total = quantity && pricePerUnit
        ? (parseFloat(quantity) * parseFloat(pricePerUnit)).toFixed(2)
        : "0.00";

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Make Offer for {security?.ticker}</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Price per Unit"
                    type="number"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Settlement Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={settlementDate}
                    onChange={(e) => setSettlementDate(e.target.value)}
                    fullWidth
                />
                <Typography variant="subtitle1">
                    Total: <strong>{total}</strong>
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleMakeOffer}
                    variant="contained"
                    disabled={!quantity || !pricePerUnit || !settlementDate}
                >
                    Make
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MakeOfferModal;
