import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Skeleton,
  Fade
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  fetchRecipientsForFast,
  createRecipientt,
  updateRecipientt
} from "../../services/AxiosBanking";
import FastPaymentPopup from "./FastPaymentPopup";
import {useAuth} from "../../context/AuthContext";

const FastPayments = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [recipientList, setRecipientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [editingRecipient, setEditingRecipient] = useState(null);

  const {userInfo } = useAuth();
  const userId = userInfo.id;
  // This is unnecessary, but to keep the changes to a minimum
  const customerId = Number(userId);

  const loadTopRecipients = async () => {
    try {
      setLoading(true);
      const data = await fetchRecipientsForFast(customerId);

      const sortedTop3 = data
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 3);

      setRecipientList(sortedTop3);
    } catch (err) {
      console.error("Failed to load recipients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopRecipients();
  }, []);

  const getInitials = (recipient) => {
    const first = recipient.firstName?.[0] || "?";
    const last = recipient.lastName?.[0] || "?";
    return `${first}.${last}.`.toUpperCase();
  };

  const handleSave = async (recipientToSave) => {
    try {
      const isEdit = !!recipientToSave.id;

      const payload = {
        fullName: `${recipientToSave.firstName || ""} ${recipientToSave.lastName || ""}`.trim(),
        address: recipientToSave.address,
        accountNumber: recipientToSave.accountNumber,
        ownerAccountId: customerId
      };

      if (isEdit) {
        await updateRecipientt(recipientToSave.id, payload);
      } else {
        await createRecipientt({ ...payload, customerId });
      }

      setOpenModal(false);
      setEditingRecipient(null);
      await loadTopRecipients();
    } catch (error) {
      console.error("Failed to save recipient:", error);
    }
  };

  return (
    <Box sx={{ padding: 3, width: "max-content" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Saved recipients
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <IconButton
          onClick={() => {
            setEditingRecipient(null);
            setOpenModal(true);
          }}
          sx={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: "2px dashed #1976d2",
            color: "#1976d2"
          }}
        >
          +
        </IconButton>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="circular" width={64} height={64} />
              <Skeleton variant="text" width={120} />
            </Box>
          ))
        ) : (
          recipientList.map((recipient, index) => {
            const fullName = `${recipient.firstName || ""} ${recipient.lastName || ""}`.trim();

            return (
              <Box
                key={recipient.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  justifyContent: "flex-start",
                  width: "100%"
                }}
              >
                <IconButton
                  title={fullName}
                  onClick={() =>
                    navigate("/new-payment-portal", { state: { recipient } })
                  }
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "#7256d6",
                    color: "#fff",
                    fontSize: "0.75rem"
                  }}
                >
                  {getInitials(recipient)}
                </IconButton>

                <Fade in={hoveredIndex === index}>
                  <Typography
                    sx={{ cursor: "default", fontSize: 14 }}
                  >
                    {fullName}
                  </Typography>
                </Fade>
              </Box>
            );
          })
        )}
      </Box>

      <FastPaymentPopup
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingRecipient(null);
        }}
        onSave={handleSave}
        recipient={editingRecipient}
      />
    </Box>
  );
};

export default FastPayments;
