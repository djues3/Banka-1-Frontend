import React, { useEffect, useState } from "react";
import Sidebar from "../../components/mainComponents/Sidebar";
import {
    Box, Card, CardContent, Typography, Tabs, Tab, TextField, Select, MenuItem, Button, Grid, InputAdornment, Collapse, IconButton, FormControl, InputLabel, OutlinedInput
} from "@mui/material";
import TransactionList from "../../components/transactionTable/TransactionList";
import { fetchAccountsForUser, fetchAccountsTransactions } from "../../services/transactionService";
import { Tune, Refresh } from "@mui/icons-material";

const TransactionsPage = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState("");
    const [amountFilter, setAmountFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");

    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const userAccounts = await fetchAccountsForUser();
                setAccounts(userAccounts);
                if (userAccounts.length > 0) {
                    setSelectedAccount(userAccounts[0].id);
                }
            } catch (err) {
                console.error("Failed to load accounts:", err);
            }
        };

        loadAccounts();
    }, []);

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            setError(null);

            try {
                if (!selectedAccount) {
                    setTransactions([]);
                    setLoading(false);
                    return;
                }

                const accountTransactions = await fetchAccountsTransactions(selectedAccount);
                const formattedTransactions = accountTransactions.map(transaction => {
                    const dateObj = new Date(transaction.timestamp);
                    return {
                        ...transaction,
                        date: dateObj.toISOString().split("T")[0],
                        time: dateObj.toLocaleTimeString()
                    };
                });

                const selectedAccountObj = accounts.find(acc => acc.id === selectedAccount);

                const fakeTransaction = {
                    id: 999,
                    sender: "Ognjen Kojic",
                    senderAccount: "111000100000000120",
                    receiver: "Kojic Ognjen",
                    receiverAccount: "6543210987654321",
                    paymentPurpose: "Test payment",
                    amount: 1500,
                    currency: "RSD",
                    status: "COMPLETED",
                    timestamp: Date.now(),
                    date: new Date().toISOString().split("T")[0],
                    time: new Date().toLocaleTimeString(),
                    paymentCode: "N/A",
                    referenceNumber: "N/A",
                    loanId: null
                };

                let allTransactions = formattedTransactions;

                if (selectedAccountObj?.accountNumber === fakeTransaction.senderAccount) {
                    allTransactions = [...formattedTransactions, fakeTransaction];
                }

                allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setTransactions(allTransactions);
            } catch (err) {
                console.error("Failed to load transactions:", err);
                setError("Failed to load transactions. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, [selectedAccount]);

    const filteredTransactions = transactions.filter(transaction => {
        if (selectedTab === 1) return false;

        const transactionDate = transaction.date;
        return (
            (!dateFilter || transactionDate === dateFilter) &&
            (!amountFilter || transaction.amount.toString().includes(amountFilter)) &&
            (!statusFilter || transaction.status === statusFilter)
        );
    });

    const resetFilters = () => {
        setDateFilter("");
        setAmountFilter("");
        setStatusFilter("");
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, padding: 3, paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Card sx={{ width: "90%", backgroundColor: "#1e1e2e", color: "#fff", borderRadius: 3, padding: 2 }}>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                Payment Overview
                            </Typography>

                            <FormControl sx={{ minWidth: 250, backgroundColor: "#2C2F36", borderRadius: 2 }}>
                                <InputLabel sx={{ color: "#A1A1A6" }}>Select an account</InputLabel>
                                <Select
                                    value={selectedAccount}
                                    onChange={(e) => setSelectedAccount(e.target.value)}
                                    displayEmpty
                                    input={<OutlinedInput sx={{ color: "#fff", padding: "10px" }} />}
                                    sx={{
                                        color: "#fff",
                                        borderRadius: 2,
                                        height: "45px",
                                        backgroundColor: "#2C2F36",
                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                        "&:hover .MuiOutlinedInput-notchedOutline": { border: "1px solid #444" },
                                        "& .MuiSelect-icon": { color: "#A1A1A6" },
                                    }}
                                >
                                    {accounts.map(account => (
                                        <MenuItem key={account.id} value={account.id}>
                                            {account.accountNumber} ({account.currency})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button
                                variant="contained"
                                color="warning"
                                startIcon={<Tune />}
                                onClick={() => setFiltersVisible(!filtersVisible)}
                                sx={{ height: "40px" }}
                            >
                                {filtersVisible ? "Hide Filters" : "Show Filters"}
                            </Button>
                        </Box>

                        <Tabs
                            value={selectedTab}
                            onChange={(_, newValue) => setSelectedTab(newValue)}
                            sx={{
                                marginBottom: 2,
                                "& .MuiTabs-indicator": { backgroundColor: "#fdfdfd" },
                                "& .MuiTab-root": { color: "#fff", fontWeight: "bold" },
                                "& .Mui-selected": { color: "#e7e7e7" }
                            }}
                        >
                            <Tab label="Domestic Payments" />
                            <Tab label="Exchange Transactions" />
                        </Tabs>

                        <Collapse in={filtersVisible} sx={{ marginTop: 2 }}>
                            <Box sx={{ padding: 2, borderRadius: 2, backgroundColor: "#2b2b3b" }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: 1,
                                                "& .MuiInputBase-input": { color: "#000" }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            type="number"
                                            placeholder="Amount"
                                            value={amountFilter}
                                            onChange={(e) => setAmountFilter(e.target.value)}
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: 1,
                                                "& .MuiInputBase-input": { color: "#000" }
                                            }}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">RSD</InputAdornment>
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Select
                                            fullWidth
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            displayEmpty
                                            sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: 1,
                                                "& .MuiSelect-select": { color: "#000" }
                                            }}
                                        >
                                            <MenuItem value="">All Statuses</MenuItem>
                                            <MenuItem value="COMPLETED">Completed</MenuItem>
                                            <MenuItem value="PENDING">Pending</MenuItem>
                                            <MenuItem value="REJECTED">Rejected</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <IconButton
                                            onClick={resetFilters}
                                            sx={{ backgroundColor: "#f3f3f3", color: "#000", borderRadius: 1 }}
                                        >
                                            <Refresh />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Collapse>

                        <TransactionList transactions={filteredTransactions} />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default TransactionsPage;