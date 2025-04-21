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
  Pagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Sidebar from "../../components/mainComponents/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  fetchAllRecipientsForUser,
  createRecipient,
  updateRecipientt,
  deleteRecipient,
  getUserIdFromToken,
  fetchAccountsForUser,
} from "../../services/AxiosBanking";
import FastPaymentPopup from "../../components/transactionComponents/FastPaymentPopup";

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

  const [page, setPage] = useState(1);
  const recipientsPerPage = 5;

  const navigate = useNavigate();

  const loadRecipients = async () => {
    const userId = getUserIdFromToken();
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

  const handleSave = async () => {
    if (
      !recipientForm.firstName.trim() ||
      !recipientForm.lastName.trim() ||
      !recipientForm.accountNumber.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const fullName = `${recipientForm.firstName} ${recipientForm.lastName}`.trim();
      const dataToSend = {
        ...recipientForm,
        fullName,
      };

      if (editingRecipientId) {
        await updateRecipientt(editingRecipientId, dataToSend);
      } else {
        await createRecipient({
          ...dataToSend,
          ownerAccountId,
        });
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
      loadRecipients();
    } catch (err) {
      console.error("Error saving recipient:", err);
      setError("Failed to save recipient.");
    }
  };

  const handleEdit = (recipient) => {
    const nameParts = recipient.fullName?.trim().split(" ") || [];
    const firstName = recipient.firstName || nameParts[0] || "";
    const lastName = recipient.lastName || nameParts.slice(1).join(" ") || "";

    setRecipientForm({
      firstName,
      lastName,
      address: recipient.address || "",
      accountNumber: recipient.accountNumber || "",
    });

    setEditingRecipientId(recipient.id);
    setShowRecipientModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipient(id);
      loadRecipients();
    } catch (err) {
      console.error("Failed to delete recipient:", err);
    }
  };

  const indexOfLast = page * recipientsPerPage;
  const indexOfFirst = indexOfLast - recipientsPerPage;
  const paginatedRecipients = recipients.slice(indexOfFirst, indexOfLast);

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
              {paginatedRecipients.map((recipient, index) => (
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
                      primary={
                        <Typography variant="subtitle1">
                          {`${recipient.firstName || ""} ${recipient.lastName || ""}`.trim()}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">
                            Account Number: {recipient.accountNumber}
                          </Typography>
                          <Typography variant="body2">
                            Address: {recipient.address}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < paginatedRecipients.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        {recipients.length > recipientsPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(recipients.length / recipientsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

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
