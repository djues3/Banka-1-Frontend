import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Tooltip, Skeleton, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddFastPayment from "./AddFastPayment";
import {
    createRecipientt,
    fetchRecipientsForFast,
    getUserIdFromToken
} from "../../services/AxiosBanking";

const FastPayments = ({ accountId }) => {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [recipient, setRecipient] = useState({ name: "", accountNumber: "" });
    const [recipientList, setRecipientList] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (userId) {
            const fetchRecipients1 = async () => {
                try {
                    setLoading(true);
                    const data = await fetchRecipientsForFast(accountId);

                    if (!data || data.length === 0) {
                        const mockRecipients = [
                            {
                                id: 101,
                                ownerAccountId: accountId,
                                accountNumber: "111122223333",
                                firstName: "Mocka",
                                lastName: "Milić",
                                address: "Test adresa 1"
                            },
                            {
                                id: 102,
                                ownerAccountId: accountId,
                                accountNumber: "222233334444",
                                firstName: "Testko",
                                lastName: "Todorović",
                                address: "Test adresa 2"
                            },
                            {
                                id: 103,
                                ownerAccountId: accountId,
                                accountNumber: "333344445555",
                                firstName: "Jovana",
                                lastName: "Mockić",
                                address: "Test adresa 3"
                            }
                        ];

                        setRecipientList(mockRecipients);

                    } else {
                        setRecipientList(data.receivers || []);
                    }
                } catch (err) {
                    setError("Failed to load recipients.");
                } finally {
                    setLoading(false);
                }
            };
            fetchRecipients1();
        } else {
            setError("User ID not found.");
            setLoading(false);
        }
    }, [accountId]);

    const handleAddRecipient = async () => {
        if (!recipient.name || !recipient.accountNumber) {
            setError("Both fields must be filled.");
            return;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
            setError("User ID not found.");
            return;
        }

        const newRecipient = {
            ownerAccountId: accountId,
            accountNumber: recipient.accountNumber,
            fullName: recipient.name
        };

        try {
            await createRecipientt(newRecipient);
            const updatedRecipients = await fetchRecipientsForFast(accountId);
            setRecipientList(updatedRecipients);
            setOpenModal(false);
            setRecipient({ name: "", accountNumber: "" });
            setError("");
        } catch (err) {
            setError("Failed to add recipient.");
        }
    };

    const getInitials = (firstName, lastName) => {
        const first = firstName?.trim()?.charAt(0)?.toUpperCase() || "";
        const last = lastName?.trim()?.charAt(0)?.toUpperCase() || "";
        return first + last;
    };


    return (
        <Box sx={{
            width: "max-content",
            borderRadius: 4,
            padding: 3,
            paddingLeft:"50px",
            bgcolor: "transparent",
            backdropFilter: "none",
            textAlign: "left",
            mb: 4
        }} >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Fast Payments
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, ml: "auto", mr: "auto", width: "fit-content" }}>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Box key={i} sx={{ display: "flex", gap: 2 }}>
                            <Skeleton variant="circular" width={64} height={64} />
                            <Skeleton variant="text" width={120} />
                        </Box>
                    ))
                ) : (
                    recipientList.map((recipient, index) => (
                        <Box
                            key={index}
                            sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >

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
                                <Typography>{recipient.firstName} {recipient.lastName}</Typography>
                            </Fade>
                        </Box>
                    ))
                )}

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
            </Box>

            <AddFastPayment
                open={openModal}
                onClose={() => setOpenModal(false)}
                onAddRecipient={handleAddRecipient}
                recipient={recipient}
                setRecipient={setRecipient}
                error={error}
            />
        </Box>
    );
};

export default FastPayments;
