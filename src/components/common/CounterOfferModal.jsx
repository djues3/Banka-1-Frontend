import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from "@mui/material";
import { counterOffer } from "../../services/AxiosTrading";

const CounterOfferModal = ({ open, onClose, offer }) => {
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [premium, setPremium] = useState("");
  const [settlementDate, setSettlementDate] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (offer) {
      setQuantity(offer.Quantity);
      setPricePerUnit(offer.PricePerUnit);
      setPremium(offer.Premium);
      setSettlementDate(offer.SettlementAt?.split("T")[0] || "");
      setError("");
    }
  }, [offer]);

  const handleSubmit = async () => {
    // Prosta validacija
    if (!quantity || !pricePerUnit || !premium || !settlementDate) {
      setError("Sva polja su obavezna.");
      return;
    }

    if (Number(quantity) <= 0 || Number(pricePerUnit) <= 0 || Number(premium) < 0) {
      setError("Unete vrednosti moraju biti validne.");
      return;
    }

    const payload = {
      quantity: Number(quantity),
      price_per_unit: Number(pricePerUnit),
      premium: Number(premium),
      settlement_date: settlementDate,
    };

    try {
      await counterOffer(offer.ID, payload);
      onClose(true);
    } catch (err) {
      console.error("Neuspešna counter ponuda:", err);
      setError("Greška pri slanju ponude.");
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Counter Offer</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
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
            label="Premium"
            type="number"
            value={premium}
            onChange={(e) => setPremium(e.target.value)}
            fullWidth
          />
          <TextField
            label="Settlement Date"
            type="date"
            value={settlementDate}
            onChange={(e) => setSettlementDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {error && (
            <Box sx={{ color: "red", mt: 1, fontSize: "0.9rem" }}>{error}</Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Send Counter Offer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CounterOfferModal;
