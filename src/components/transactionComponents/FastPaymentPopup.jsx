import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {useAuth} from "../../context/AuthContext";

const FastPaymentPopup = ({
  open,
  onClose,
  onSave,
  recipient,
  setRecipient,
  error
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    accountNumber: ""
  });

  const {userInfo } = useAuth();
  const userId = userInfo.id;

  useEffect(() => {
    if (!open) return;

    if (recipient) {
      const firstName = recipient.firstName || "";
      const lastName = recipient.lastName || "";

      console.log("Popup recipient:", recipient);

      setForm({
        firstName,
        lastName,
        address: recipient.address || "",
        accountNumber: recipient.accountNumber || ""
      });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        address: "",
        accountNumber: ""
      });
    }
  }, [recipient, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSave = () => {
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const customerId = Number(userId);

    const recipientToSave = {
      ...(recipient?.id ? { id: recipient.id } : {}),
      customerId,
      fullName,
      address: form.address,
      accountNumber: form.accountNumber
    };

    onSave(recipientToSave);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 450,
          backgroundColor: isDarkMode ? "#212128" : "#f0f0f0",
          color: isDarkMode ? "#fff" : "#000",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          mx: "auto",
          mt: "5%"
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {recipient && recipient.id ? "Edit recipient" : "Add fast payment recipient"}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: isDarkMode ? "#ccc" : "#000" } }}
            InputProps={{ style: { color: isDarkMode ? "#fff" : "#000" } }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: isDarkMode ? "#ccc" : "#000" } }}
            InputProps={{ style: { color: isDarkMode ? "#fff" : "#000" } }}
          />
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: isDarkMode ? "#ccc" : "#000" } }}
            InputProps={{ style: { color: isDarkMode ? "#fff" : "#000" } }}
          />
          <TextField
            label="Account Number"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { color: isDarkMode ? "#ccc" : "#000" } }}
            InputProps={{ style: { color: isDarkMode ? "#fff" : "#000" } }}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={onClose} sx={{ mr: 2 }} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default FastPaymentPopup;
