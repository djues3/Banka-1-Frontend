import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Sidebar from "../../components/mainComponents/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import {
  fetchAllRecipientsForUser,
  createRecipientt,
  updateRecipientt,
  deleteRecipient,
  fetchAccountsForUser,
} from "../../services/AxiosBanking";
import FastPaymentPopup from "../../components/transactionComponents/FastPaymentPopup";
import {useAuth} from "../../context/AuthContext";

const RecipientOverviewPage = () => {
  const [recipients, setRecipients] = useState([]);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [recipientForm, setRecipientForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    accountNumber: "",
  });
  const [editingRecipientId, setEditingRecipientId] = useState(null);
  const [error, setError] = useState("");
  const [ownerAccountId, setOwnerAccountId] = useState(null);

  const navigate = useNavigate();
  const {userInfo } = useAuth();
  const userId = userInfo.id;
  const loadRecipients = async () => {
    if (!userId) return;
    try {
      const accounts = await fetchAccountsForUser();
      if (accounts.length > 0) setOwnerAccountId(accounts[0].id);

      const data = await fetchAllRecipientsForUser(userId);
      setRecipients(data || []);
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const handleSave = async (newRecipient) => {
    try {
      let firstName = newRecipient.firstName;
      let lastName = newRecipient.lastName;
  
      if (!firstName || !lastName) {
        const nameParts = newRecipient.fullName?.trim().split(" ") || [];
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }
  
      if (!firstName.trim() || !lastName.trim() || !newRecipient.accountNumber?.trim()) {
        setError("All fields are required.");
        return;
      }
  
      const fullName = `${firstName} ${lastName}`.trim();
  
      const customerId = Number(userId);
      if (!customerId || isNaN(customerId)) {
        throw new Error("Invalid customer ID");
      }
  
      const requestData = {
        accountNumber: newRecipient.accountNumber,
        address: newRecipient.address || "",
        fullName,
        customerId
      };

      console.log("EDIT MODE:", !!newRecipient.id);
      console.log("Data to send:", requestData);
      console.log("Recipient ID:", newRecipient.id);
  
      if (newRecipient.id) {
        await updateRecipientt(newRecipient.id, requestData);
        toast.success("Recipient updated successfully!");

      } else {
        await createRecipientt(requestData);
        toast.success("Recipient created successfully!");

      }
  
      setShowRecipientModal(false);
      setRecipientForm({
        firstName: "",
        lastName: "",
        address: "",
        accountNumber: "",
      });
      setEditingRecipientId(null);
      setError("");
      await loadRecipients();
    } catch (err) {
      console.error("Error saving recipient:", err);
      toast.error("Failed to save recipient.");
      setError("Failed to save recipient.");
    }
  };
  

  const handleEdit = (recipient) => {
    const fullNameText = `${recipient.firstName || ""} ${recipient.lastName || ""}`.trim();
  
    const nameParts = fullNameText.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
  
    console.log("DEBUG | EDIT - fullName:", fullNameText);
    console.log("DEBUG | Parsed firstName:", firstName);
    console.log("DEBUG | Parsed lastName:", lastName);
  
    setRecipientForm({
      id: recipient.id,
      firstName: recipient.firstName,
      lastName: recipient.lastName,
      address: recipient.address || "",
      accountNumber: recipient.accountNumber || ""
    });
  
    setEditingRecipientId(recipient.id);
    setShowRecipientModal(true);
  };
  
  
  

  const handleDelete = async (id) => {
    try {
      await deleteRecipient(id);
      toast.success("Recipient deleted successfully!");
      loadRecipients();
    } catch (err) {
      console.error("Failed to delete recipient:", err);
      toast.error("Failed to delete recipient.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4, pt: 10 }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5">Saved recipients</Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setEditingRecipientId(null);
              setRecipientForm({
                firstName: "",
                lastName: "",
                address: "",
                accountNumber: "",
              });
              setShowRecipientModal(true);
            }}
            sx={{
              borderColor: "#aab4f8",
              color: "#aab4f8",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(170, 180, 248, 0.1)",
                borderColor: "#aab4f8",
                color: "#aab4f8",
              },
              textTransform: "none",
            }}
          >
            New recipient
          </Button>
        </Box>

        <Paper elevation={3}>
          {recipients.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography>No saved recipients found.</Typography>
            </Box>
          ) : (
            <List>
              {recipients.map((recipient, index) => (
                <React.Fragment key={recipient.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <Button
                          variant="outlined"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={() =>
                            navigate("/new-payment-portal", {
                              state: { recipient },
                            })
                          }
                        >
                          New Payment
                        </Button>
                        <IconButton onClick={() => handleEdit(recipient)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(recipient.id)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={`${recipient.firstName || ""} ${recipient.lastName || ""}`.trim()}
                      secondary={
                        <>
                          <div>Account Number: {recipient.accountNumber}</div>
                          <div>Address: {recipient.address}</div>
                        </>
                      }
                    />
                  </ListItem>
                  {index < recipients.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        <FastPaymentPopup
          open={showRecipientModal}
          onClose={() => setShowRecipientModal(false)}
          onSave={handleSave}
          recipient={recipientForm}
          setRecipient={setRecipientForm}
          error={error}
        />
      </Box>
    </Box>
  );
};

export default RecipientOverviewPage;
