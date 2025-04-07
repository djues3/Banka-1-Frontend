import React, { useState, useEffect } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import {
    Box,
    Button,
    Typography,
    IconButton,
    CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CreateCardModal from "../../components/common/CreateCardModal";
import CreditCardDisplay from "../../components/common/CreditCardDisplay";
import CardDetailsModal from "../../components/common/CardDetailsModal";
import {
    fetchAccountsForUser,
    fetchUserCards,
    getUserIdFromToken
} from "../../services/AxiosBanking";
import { AnimatePresence, motion } from "framer-motion";
import {ToastContainer} from "react-toastify";

const CardsPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                setError("User ID not found.");
                setLoading(false);
                return;
            }

            const accounts = await fetchAccountsForUser(userId);
            if (!Array.isArray(accounts) || accounts.length === 0) {
                setLoading(false);
                return;
            }

            const cardPromises = accounts.map(async (account) => {
                try {
                    const res = await fetchUserCards(account.id);
                    const cards = res.data?.cards || [];
                    return cards.map(card => ({ ...card, account }));
                } catch {
                    return [];
                }
            });

            const result = await Promise.all(cardPromises);
            console.log("Sve kartice = ", result);
            setCards(result.flat());
        } catch (err) {
            console.error(err);
            setError("Failed to load cards");
        } finally {
            setLoading(false);
        }
    };

    const handlePrev = () => {
        if (!cards.length) return;
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const handleNext = () => {
        if (!cards.length) return;
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    return (
        <>
            <Sidebar />
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "76px",
                    paddingBottom: "16px"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        maxWidth: "800px",
                        px: 1,
                        gap: 1.3,
                    }}
                >
                    <Typography variant="h4" align="center" fontWeight="bold">
                        Cards
                    </Typography>

                    <Box
                        sx={{
                            height: "500px",
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                        }}
                    >
                        {loading ? (
                            <CircularProgress />
                        ) : error ? (
                            <Typography color="error">{error}</Typography>
                        ) : cards.length === 0 ? (
                            <Typography>No cards found.</Typography>
                        ) : (
                            <>
                                {cards.length > 1 && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            left: "-220px",
                                            transform: "scale(0.65) rotateY(10deg)",
                                            opacity: 0.2,
                                            filter: "grayscale(1) blur(2px)",
                                            pointerEvents: "none",
                                            transition: "all 0.4s ease-in-out"
                                        }}
                                    >
                                        <CreditCardDisplay
                                            card={cards[(currentIndex - 1 + cards.length) % cards.length]}
                                            onBlockToggle={() => {}}
                                            onActiveToggle={() => {}}
                                            theme="dark"
                                        />
                                    </Box>
                                )}

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={cards[currentIndex]?.id}
                                        initial={{ opacity: 0, x: 150 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -150 }}
                                        transition={{ duration: 0.5 }}
                                        style={{ zIndex: 2, cursor: "pointer", transform: "scale(0.85)" }}
                                        onClick={() => setDetailsModalOpen(true)}
                                    >
                                        <CreditCardDisplay
                                            card={cards[currentIndex]}
                                            onBlockToggle={() => {}}
                                            onActiveToggle={() => {}}
                                            theme="dark"
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {cards.length > 1 && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            right: "-220px",
                                            transform: "scale(0.65) rotateY(-10deg)",
                                            opacity: 0.2,
                                            filter: "grayscale(1) blur(2px)",
                                            pointerEvents: "none",
                                            transition: "all 0.4s ease-in-out"
                                        }}
                                    >
                                        <CreditCardDisplay
                                            card={cards[(currentIndex + 1) % cards.length]}
                                            onBlockToggle={() => {}}
                                            onActiveToggle={() => {}}
                                            theme="dark"
                                        />
                                    </Box>
                                )}

                                <IconButton
                                    onClick={handlePrev}
                                    sx={{ position: "absolute", left: -40, zIndex: 3 }}
                                >
                                    <ArrowBackIosIcon />
                                </IconButton>

                                <IconButton
                                    onClick={handleNext}
                                    sx={{ position: "absolute", right: -40, zIndex: 3 }}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setModalOpen(true)}
                        sx={{
                            width: "100%",
                            maxWidth: "680px",
                            py: 1.2,
                            borderRadius: 2,
                            fontSize: "1rem",
                            fontWeight: 600,
                            background: "linear-gradient(135deg, rgba(26, 26, 26, 0.2), #333360, #1a1a1a)",
                            color: "#fff",
                            boxShadow: "0px 4px 12px rgba(123, 97, 255, 0.3)",
                            transition: "all 0.3s ease-in-out",
                        }}
                    >
                        Add Card
                    </Button>
                </Box>
            </Box>

            <CreateCardModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={async (wasCreated) => {
                    if (wasCreated) {
                        await fetchAllData();
                    }
                }}
            />

            <CardDetailsModal
                open={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                card={cards[currentIndex]}
            />
            <ToastContainer position="bottom-right"/>
        </>
    );
};

export default CardsPage;