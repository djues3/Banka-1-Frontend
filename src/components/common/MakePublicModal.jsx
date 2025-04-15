import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from "@mui/material";

const MakePublicModal = ({ open, onClose, onConfirm, maxAmount }) => {
  const [count, setCount] = useState(0);

  const handleConfirm = () => {
    if (count > 0 && count <= maxAmount) {
      onConfirm(count);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Make Public</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Enter the number of shares to make public (max: {maxAmount})
        </Typography>
        <TextField
          type="number"
          fullWidth
          value={count}
          onChange={(e) =>
            setCount(Math.max(0, Math.min(Number(e.target.value), maxAmount)))
          }
          inputProps={{ min: 0, max: maxAmount }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MakePublicModal;
