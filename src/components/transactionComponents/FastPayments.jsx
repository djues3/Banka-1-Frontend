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
  getUserIdFromToken
} from "../../services/AxiosBanking";
import FastPaymentPopup from "./FastPaymentPopup";

const FastPayments = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [recipientList, setRecipientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const loadTopRecipients = async () => {
    const userId = getUserIdFromToken();
    if (userId) {
      try {
        setLoading(true);
        const data = await fetchRecipientsForFast(userId);
        setRecipientList(data);
      } catch (err) {
        console.error("Failed to load recipients.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadTopRecipients();
  }, []);

  const getInitials = (recipient) => {
    const first = recipient.firstName?.[0]?.toUpperCase() || "?";
    const last = recipient.lastName?.[0]?.toUpperCase() || "?";
    return `${first}.${last}.`;
  };

  const getFullName = (recipient) => {
    if (!recipient.firstName && !recipient.lastName) return "Unknown";
    return `${recipient.firstName || ""} ${recipient.lastName || ""}`.trim();
  };

  return (
    <Box
      sx={{
        width: "max-content",
        borderRadius: 4,
        padding: 3,
        paddingLeft: "50px",
        bgcolor: "transparent",
        backdropFilter: "none",
        textAlign: "left",
        mb: 4
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Fast Payments
      </Typography>

      {/* Dugme "+" iznad liste */}
      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={() => setOpenModal(true)}
          sx={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: "transparent",
            border: "2px dashed #1976d2",
            color: "#1976d2",
            fontSize: "20px",
            fontWeight: "bold"
          }}
        >
          +
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="circular" width={64} height={64} />
              <Skeleton variant="text" width={120} />
            </Box>
          ))
        ) : (
          recipientList.map((recipient, index) => (
            <Box key={recipient.id || index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={() => navigate("/new-payment-portal", { state: { recipient } })}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  backgroundColor: "#7256d6",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "#6244d5"
                  }
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {getInitials(recipient)}
              </IconButton>

              <Fade in={hoveredIndex === index}>
                <Typography>{getFullName(recipient)}</Typography>
              </Fade>
            </Box>
          ))
        )}
      </Box>

      <FastPaymentPopup
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={loadTopRecipients}
      />
    </Box>
  );
};

export default FastPayments;
