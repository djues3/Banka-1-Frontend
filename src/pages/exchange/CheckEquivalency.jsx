import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    Container,
    Grid,
    TextField,
    Button,
    Alert,
    MenuItem,
    CircularProgress,
    Box,
    Toolbar
} from '@mui/material';
import { previewExchangeTransfer, previewForeignExchangeTransfer } from '../../services/AxiosBanking';
import Sidebar from '../../components/mainComponents/Sidebar';

const CheckEquivalency = () => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('RSD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const supportedCurrencies = ['EUR', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'RSD'];

    const handleConversion = async () => {
        if (!amount) return;

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let conversionResult;
            if (fromCurrency === toCurrency) {
                conversionResult = {
                    convertedAmount: numericAmount,
                    provision: 0,
                    finalAmount: numericAmount,
                    fee: 0,
                    exchangeRate: 1
                };
            } else if (fromCurrency === "RSD" || toCurrency === "RSD") {
                conversionResult = await previewExchangeTransfer(fromCurrency, toCurrency, numericAmount);
            } else {
                conversionResult = await previewForeignExchangeTransfer(fromCurrency, toCurrency, numericAmount);
            }

            // Handle different response formats
            if (fromCurrency === toCurrency || fromCurrency === "RSD" || toCurrency === "RSD") {
                setResult({
                    originalAmount: numericAmount,
                    convertedAmount: conversionResult.convertedAmount.toFixed(2),
                    commission: conversionResult.provision.toFixed(2),
                    finalAmount: conversionResult.finalAmount.toFixed(2),
                    exchangeRate: conversionResult.exchangeRate.toFixed(6),
                    fromCurrency: fromCurrency,
                    toCurrency: toCurrency
                });
            } else {
                // Handle foreign exchange response
                setResult({
                    originalAmount: numericAmount,
                    firstExchangeRate: conversionResult.firstExchangeRate.toFixed(6),
                    secondExchangeRate: conversionResult.secondExchangeRate.toFixed(6),
                    provision: conversionResult.provision.toFixed(2),
                    finalAmount: conversionResult.finalAmount.toFixed(2),
                    fromCurrency: fromCurrency,
                    toCurrency: toCurrency
                });
            }
        } catch (err) {
            setError('Failed to convert currency. Please try again later.');
            console.error('Error converting currency:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader
                            title="Currency Converter"
                            sx={{ bgcolor: 'primary.main', color: 'white' }}
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="From Currency"
                                        value={fromCurrency}
                                        onChange={(e) => setFromCurrency(e.target.value)}
                                    >
                                        {supportedCurrencies.map(currency => (
                                            <MenuItem key={currency} value={currency}>
                                                {currency}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="To Currency"
                                        value={toCurrency}
                                        onChange={(e) => setToCurrency(e.target.value)}
                                    >
                                        {supportedCurrencies.map(currency => (
                                            <MenuItem key={currency} value={currency}>
                                                {currency}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleConversion}
                                        disabled={!amount || loading}
                                        fullWidth
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Convert'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {result && (
                        <Card>
                            <CardHeader
                                title="Conversion Result"
                                sx={{ bgcolor: 'success.main', color: 'white' }}
                            />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Alert severity="info">
                                            Original Amount: {result.originalAmount} {result.fromCurrency}
                                        </Alert>
                                    </Grid>
                                    {result.convertedAmount !== undefined ? (
                                        // Regular exchange response
                                        <>
                                            <Grid item xs={12}>
                                                <Alert severity="success">
                                                    Converted Amount: {result.convertedAmount} {result.toCurrency}
                                                </Alert>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Alert severity="warning">
                                                    Commission: {result.commission} {result.toCurrency}
                                                </Alert>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Alert severity="info">
                                                    Final Amount: {result.finalAmount} {result.toCurrency}
                                                </Alert>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Alert severity="info">
                                                    Exchange Rate: {result.exchangeRate}
                                                </Alert>
                                            </Grid>
                                        </>
                                    ) : (
                                        // Foreign exchange response
                                        <>
                                            <Grid item xs={12}>
                                                <Alert severity="info">
                                                    First Exchange Rate: {result.firstExchangeRate}
                                                </Alert>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Alert severity="info">
                                                    Second Exchange Rate: {result.secondExchangeRate}
                                                </Alert>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Alert severity="warning">
                                                    Commission: {result.provision} {result.toCurrency}
                                                </Alert>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Alert severity="success">
                                                    Final Amount: {result.finalAmount} {result.toCurrency}
                                                </Alert>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Container>
    );

    return (
        <>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* This creates space for the AppBar */}
                {renderContent()}
            </Box>
        </>
    );
};

export default CheckEquivalency; 