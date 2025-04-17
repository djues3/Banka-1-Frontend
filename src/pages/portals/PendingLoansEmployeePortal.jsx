
import React, { useState, useEffect } from "react";
import {
    Typography,
    Card,
    CardContent,
    CardActions,
    useTheme,
    Box,
    IconButton,
    Grid,
} from "@mui/material";
import Sidebar from "../../components/mainComponents/Sidebar";
import { toast } from "react-toastify";
import { fetchAllPendingLoans } from "../../services/AxiosBanking";
import ApproveLoanButton from "../../components/common/ApproveLoanButton";
import DenyLoanButton from "../../components/common/DenyLoanButton";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const PendingLoansEmployeePortal = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const theme = useTheme();

    const CARDS_PER_PAGE = 6;

    useEffect(() => {
        loadLoans();
    }, [refreshKey]);

    const loadLoans = async () => {
        try {
            setLoading(true);
            const filteredLoans = await fetchAllPendingLoans();

            const formattedLoans = filteredLoans.map((loan) => ({
                id: loan.id,
                loanType: loan.loanType,
                numberOfInstallments: loan.numberOfInstallments ?? "N/A",
                currencyType: loan.currencyType,
                interestType: loan.interestType,
                paymentStatus: loan.paymentStatus,
                nominalRate: loan.nominalRate,
                effectiveRate: loan.effectiveRate,
                loanAmount: loan.loanAmount.toFixed(2),
                duration: loan.duration,
                createdDate: new Date(loan.createdDate).toLocaleDateString(),
                allowedDate: new Date(loan.allowedDate).toLocaleDateString(),
                monthlyPayment: loan.monthlyPayment.toFixed(2),
                nextPaymentDate: new Date(loan.nextPaymentDate).toLocaleDateString(),
                remainingAmount: loan.remainingAmount.toFixed(2),
                loanReason: loan.loanReason || "N/A",
                accountNumber: loan.account?.accountNumber ?? "N/A",
            }));

            setLoans(formattedLoans);
        } catch (err) {
            console.error("Error loading loans:", err);
            setError("Failed to load loans data");
            toast.error("Failed to load loans data");
            setLoans([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex + CARDS_PER_PAGE < loans.length) {
            setCurrentIndex(currentIndex + CARDS_PER_PAGE);
        }
    };

    const handlePrev = () => {
        if (currentIndex - CARDS_PER_PAGE >= 0) {
            setCurrentIndex(currentIndex - CARDS_PER_PAGE);
        }
    };

    const visibleLoans = loans.slice(currentIndex, currentIndex + CARDS_PER_PAGE);

    return (
        <div>
            <Sidebar />
            <Box sx={{ padding: "20px", marginTop: "64px", width: "100%" }}>
                <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                    Pending Loans Overview
                </Typography>

                {loading ? (
                    <Typography textAlign="center">Loading...</Typography>
                ) : error ? (
                    <Typography color="error" textAlign="center">{error}</Typography>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Grid container spacing={3} sx={{ maxWidth: 1400 }}>
                            {visibleLoans.map((loan) => (
                                <Grid item xs={12} sm={6} md={4} key={loan.id}>
                                    <Card
                                        sx={{
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? theme.palette.background.paper
                                                    : "#fff",
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {loan.loanType} ({loan.currencyType})
                                            </Typography>
                                            <Typography variant="body2"><strong>Loan Amount:</strong> {loan.loanAmount}</Typography>
                                            <Typography variant="body2"><strong>Monthly Payment:</strong> {loan.monthlyPayment}</Typography>
                                            <Typography variant="body2"><strong>Remaining:</strong> {loan.remainingAmount}</Typography>
                                            <Typography variant="body2"><strong>Installments:</strong> {loan.numberOfInstallments}</Typography>
                                            <Typography variant="body2"><strong>Account:</strong> {loan.accountNumber}</Typography>
                                            <Typography variant="body2"><strong>Next Payment:</strong> {loan.nextPaymentDate}</Typography>
                                            <Typography variant="body2"><strong>Purpose:</strong> {loan.loanReason}</Typography> {/* 👈 Dodato */}
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                                            <ApproveLoanButton
                                                loanId={loan.id}
                                                onAction={() => setRefreshKey((prev) => prev + 1)}
                                                style={{ borderRadius: "20px", textTransform: "none", fontWeight: "bold" }}
                                            />
                                            <DenyLoanButton
                                                loanId={loan.id}
                                                onAction={() => setRefreshKey((prev) => prev + 1)}
                                                label="Decline"
                                                style={{ borderRadius: "20px", textTransform: "none", fontWeight: "bold" }}
                                            />
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 4 }}>
                            <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
                                <ArrowBackIos />
                            </IconButton>
                            <IconButton
                                onClick={handleNext}
                                disabled={currentIndex + CARDS_PER_PAGE >= loans.length}
                            >
                                <ArrowForwardIos />
                            </IconButton>
                        </Box>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default PendingLoansEmployeePortal;