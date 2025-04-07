import React, { useEffect, useState } from "react";
import {
    Typography,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    TableContainer,
    Box
} from "@mui/material";
import TransactionDetailsModal from "./TransactionDetailsModal";
import { fetchAccountsTransactions } from "../../services/transactionService";

const RecentTransactions = ({ accountId }) => {
    const [open, setOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTransactions = async () => {
            if (!accountId) {
                setLoading(false);
                return;
            }
            try {
                const data = await fetchAccountsTransactions(accountId);
                console.log("OVOOOO", data)
                if (data && Array.isArray(data)) {
                    const enriched = data.map((tx) => {
                        const isIncoming = tx.receiverId === accountId;
                        const direction = isIncoming ? "incoming" : "outgoing";
                        return {
                            ...tx,
                            direction,
                        };
                    });
                    setTransactions(enriched);
                } else {
                    setTransactions([]);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };
        loadTransactions();
    }, [accountId]);

    const handleRowClick = (transaction) => {
        setSelectedTransaction(transaction);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedTransaction(null);
    };

    return (
        <Box
            sx={{
                width: 800,
                borderRadius: 4,
                padding: 3,
                bgcolor: "transparent",
                backdropFilter: "none",
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, textAlign: "left", color: "#fff" }}>
                Latest Transactions
            </Typography>

            {loading ? (
                <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
                    Loading transactions...
                </Typography>
            ) : transactions.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center", color: "gray" }}>
                    This account has no transactions.
                </Typography>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "transparent", boxShadow: "none" }}
                >
                    <Table sx={{ minWidth: 650, fontSize: "1rem" }} size="medium">
                        <TableHead>
                            <TableRow sx={{ height: 56 }}>
                                <TableCell sx={{ color: "#595992", borderBottom: "none", fontWeight: "bold", fontSize: "1rem" }}>
                                    Type
                                </TableCell>
                                <TableCell sx={{ color: "#595992", borderBottom: "none", fontWeight: "bold", fontSize: "1rem" }}>
                                    Transaction
                                </TableCell>
                                <TableCell sx={{ color: "#595992", borderBottom: "none", fontWeight: "bold", fontSize: "1rem" }}>
                                    Amount
                                </TableCell>
                                <TableCell sx={{ color: "#595992", borderBottom: "none", fontWeight: "bold", fontSize: "1rem" }}>
                                    Currency
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((row) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    onClick={() => handleRowClick(row)}
                                    sx={{
                                        cursor: "pointer",
                                        height: 52,
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                    }}
                                >
                                    <TableCell sx={{  borderBottom: "none", fontSize: "1rem" }}>
                                        <Chip
                                            label={row.direction === "incoming" ? "Incoming" : "Outgoing"}
                                            size="small"
                                            sx={{
                                                backgroundColor: row.direction === "incoming" ? "#2e7d32" : "#c62828",
                                                color: "white",
                                                fontWeight: "bold",
                                                fontSize: "0.75rem",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: "none", fontSize: "1rem" }}>
                                        {row.receiverAccount}
                                    </TableCell>
                                    <TableCell sx={{  borderBottom: "none", fontSize: "1rem" }}>
                                        {row.amount}
                                    </TableCell>
                                    <TableCell sx={{  borderBottom: "none", fontSize: "1rem" }}>
                                        {row.currency}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <TransactionDetailsModal
                open={open}
                onClose={handleClose}
                transaction={selectedTransaction}
            />
        </Box>
    );
};

export default RecentTransactions;
