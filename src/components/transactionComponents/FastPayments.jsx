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
  getUserIdFromToken,
  createRecipientt
} from "../../services/AxiosBanking";
import FastPaymentPopup from "./FastPaymentPopup";

const FastPayments = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [recipientList, setRecipientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const rawUserId = getUserIdFromToken();
  const customerId = Number(rawUserId);

  const loadTopRecipients = async () => {
    if (customerId && !isNaN(customerId)) {
      try {
        setLoading(true);
        const data = await fetchRecipientsForFast(customerId);
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

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "?.?";
    return `${firstName[0]}.${lastName[0]}.`.toUpperCase();
  };

  const handleSave = async (newRecipient) => {
    try {
      const userId = getUserIdFromToken();
      const customerId = Number(userId);
  
      console.log("Raw user ID from token:", userId, "Type:", typeof userId);
      console.log("Converted customerId (as number):", customerId, "Type:", typeof customerId);
      console.log("New recipient input:", newRecipient);
  
      if (!customerId || isNaN(customerId)) {
        console.error("Invalid customer ID:", customerId);
        throw new Error("User ID is not a valid number.");
      }
  
      const requestData = {
        customerId,
        accountNumber: newRecipient.accountNumber,
        fullName: `${newRecipient.firstName} ${newRecipient.lastName}`.trim(),
        address: newRecipient.address || ""
      };
  
      console.log("Final data being sent to backend:", requestData);
  
      await createRecipientt(requestData);
      setOpenModal(false);
      await loadTopRecipients();
    } catch (error) {
      console.error("Failed to save recipient:", error);
    }
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

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
        <Box>
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
                  fontWeight: "italic",
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "#6244d5"
                  }
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {getInitials(recipient.firstName, recipient.lastName)}
              </IconButton>

              <Fade in={hoveredIndex === index}>
                <Typography>
                  {`${recipient.firstName || ""} ${recipient.lastName || ""}`.trim() || "Unknown"}
                </Typography>
              </Fade>
            </Box>
          ))
        )}
      </Box>

      <FastPaymentPopup
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        customerId={customerId} 
      />
    </Box>
  );
};

export default FastPayments;
