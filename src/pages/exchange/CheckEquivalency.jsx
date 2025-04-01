import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    MenuItem,
    TextField,
    Toolbar,
    Typography,
    Alert,
    useTheme
} from '@mui/material';
import Sidebar from '../../components/mainComponents/Sidebar';
import { previewExchangeTransfer, previewForeignExchangeTransfer } from '../../services/AxiosBanking';

const CheckEquivalency = () => {
    const theme = useTheme();
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('RSD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const supportedCurrencies = ['EUR', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD', 'RSD'];

    const getCountryCode = (currency) => {
        const map = {
            EUR: 'eu',
            CHF: 'ch',
            USD: 'us',
            GBP: 'gb',
            JPY: 'jp',
            CAD: 'ca',
            AUD: 'au',
            RSD: 'rs',
        };
        return map[currency] || 'xx';
    };

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
                    exchangeRate: 1
                };
            } else if (fromCurrency === 'RSD' || toCurrency === 'RSD') {
                conversionResult = await previewExchangeTransfer(fromCurrency, toCurrency, numericAmount);
            } else {
                conversionResult = await previewForeignExchangeTransfer(fromCurrency, toCurrency, numericAmount);
            }

            setResult({
                ...conversionResult,
                originalAmount: numericAmount,
                fromCurrency,
                toCurrency
            });
        } catch (err) {
            setError('Conversion failed. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                <Toolbar />
                <Container maxWidth="xl">
                    <Box display="flex" flexDirection="column" gap={5} alignItems="center">
                        <Typography
                            variant="h2"
                            fontWeight={700}
                            sx={{ textAlign: 'center', fontSize: { xs: '2.6rem', md: '3.4rem' } }}
                        >
                            Currency Converter
                        </Typography>

                        <Card
                            sx={{
                                width: '100%',
                                maxWidth: '1300px',
                                borderRadius: 4,
                                boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
                                p: 5,
                            }}
                        >
                            <CardHeader
                                title="Enter Conversion Details"
                                sx={{ px: 0, pb: 3, fontWeight: 700, typography: 'h4' }}
                            />
                            <CardContent sx={{ px: 0 }}>
                                <Box display="flex" flexDirection="column" gap={4}>
                                    <TextField
                                        fullWidth
                                        label="Amount"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        InputProps={{ sx: { height: 80, fontSize: '1.6rem' } }}
                                        InputLabelProps={{ sx: { fontSize: '1.5rem' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        select
                                        label="From Currency"
                                        value={fromCurrency}
                                        onChange={(e) => setFromCurrency(e.target.value)}
                                        InputProps={{ sx: { height: 80, fontSize: '1.6rem' } }}
                                        InputLabelProps={{ sx: { fontSize: '1.5rem' } }}
                                        SelectProps={{
                                            renderValue: (value) => (
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <img
                                                        src={`https://flagcdn.com/24x18/${getCountryCode(value)}.png`}
                                                        alt={`${value} flag`}
                                                        width="24"
                                                        height="18"
                                                        style={{ borderRadius: 2, objectFit: 'cover' }}
                                                    />
                                                    <Typography fontSize="1.5rem">{value}</Typography>
                                                </Box>
                                            )
                                        }}
                                    >
                                        {supportedCurrencies.map((currency) => (
                                            <MenuItem
                                                key={currency}
                                                value={currency}
                                                sx={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 2 }}
                                            >
                                                <img
                                                    src={`https://flagcdn.com/24x18/${getCountryCode(currency)}.png`}
                                                    alt={`${currency} flag`}
                                                    width="24"
                                                    height="18"
                                                    style={{ borderRadius: 2, objectFit: 'cover' }}
                                                />
                                                {currency}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        select
                                        label="To Currency"
                                        value={toCurrency}
                                        onChange={(e) => setToCurrency(e.target.value)}
                                        InputProps={{ sx: { height: 80, fontSize: '1.6rem' } }}
                                        InputLabelProps={{ sx: { fontSize: '1.5rem' } }}
                                        SelectProps={{
                                            renderValue: (value) => (
                                                <Box display="flex" alignItems="center" gap={2}>
                                                    <img
                                                        src={`https://flagcdn.com/24x18/${getCountryCode(value)}.png`}
                                                        alt={`${value} flag`}
                                                        width="24"
                                                        height="18"
                                                        style={{ borderRadius: 2, objectFit: 'cover' }}
                                                    />
                                                    <Typography fontSize="1.5rem">{value}</Typography>
                                                </Box>
                                            )
                                        }}
                                    >
                                        {supportedCurrencies.map((currency) => (
                                            <MenuItem
                                                key={currency}
                                                value={currency}
                                                sx={{
                                                    fontSize: '1.5rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2
                                                }}
                                            >
                                                <img
                                                    src={`https://flagcdn.com/24x18/${getCountryCode(currency)}.png`}
                                                    alt={`${currency} flag`}
                                                    width="24"
                                                    height="18"
                                                    style={{ borderRadius: 2, objectFit: 'cover' }}
                                                />
                                                {currency}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleConversion}
                                        disabled={!amount || loading}
                                        sx={{
                                            py: 2.5,
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                            borderRadius: 3,
                                            backgroundColor: theme.palette.primary.dark,
                                            color: '#fff',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: '#2e2e6a',
                                                transform: 'scale(1.02)',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                            },
                                        }}
                                    >
                                        {loading ? <CircularProgress size={32} color="inherit" /> : 'Convert'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>

                        {error && (
                            <Alert severity="error" sx={{ width: '100%', maxWidth: '1300px', fontSize: '1.4rem' }}>
                                {error}
                            </Alert>
                        )}

                        {result && (
                            <Card
                                sx={{
                                    width: '100%',
                                    maxWidth: '1300px',
                                    borderRadius: 4,
                                    boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
                                    p: 5,
                                }}
                            >
                                <CardHeader
                                    title="Conversion Result"
                                    sx={{ px: 0, pb: 3, fontWeight: 700, typography: 'h4' }}
                                />
                                <CardContent sx={{ px: 0 }}>
                                    <Box display="flex" flexDirection="column" gap={3}>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <img
                                                src={`https://flagcdn.com/32x24/${getCountryCode(result.fromCurrency)}.png`}
                                                alt={`${result.fromCurrency} flag`}
                                                width="32"
                                                height="24"
                                                style={{ borderRadius: 2, objectFit: 'cover' }}
                                            />
                                            <Typography fontSize="1.5rem" fontWeight={600}>
                                                {result.fromCurrency}
                                            </Typography>
                                            <Typography fontSize="1.5rem" fontWeight={600}>→</Typography>
                                            <img
                                                src={`https://flagcdn.com/32x24/${getCountryCode(result.toCurrency)}.png`}
                                                alt={`${result.toCurrency} flag`}
                                                width="32"
                                                height="24"
                                                style={{ borderRadius: 2, objectFit: 'cover' }}
                                            />
                                            <Typography fontSize="1.5rem" fontWeight={600}>
                                                {result.toCurrency}
                                            </Typography>
                                        </Box>

                                        <Typography fontSize="1.5rem">
                                            Original: {result.originalAmount} {result.fromCurrency}
                                        </Typography>

                                        {'convertedAmount' in result && (
                                            <>
                                                <Typography fontSize="1.5rem">
                                                    Converted: {result.convertedAmount} {result.toCurrency}
                                                </Typography>
                                                <Typography fontSize="1.5rem">
                                                    Commission: {result.provision} {result.toCurrency}
                                                </Typography>
                                                <Typography fontSize="1.5rem">
                                                    Final: {result.finalAmount} {result.toCurrency}
                                                </Typography>
                                                <Typography fontSize="1.5rem">
                                                    Exchange Rate: {result.exchangeRate}
                                                </Typography>
                                            </>
                                        )}

                                        {'firstExchangeRate' in result && (
                                            <>
                                                <Typography fontSize="1.5rem">
                                                    First Rate: {result.firstExchangeRate}
                                                </Typography>
                                                <Typography fontSize="1.5rem">
                                                    Second Rate: {result.secondExchangeRate}
                                                </Typography>
                                                <Typography fontSize="1.5rem">
                                                    Commission: {result.provision} {result.toCurrency}
                                                </Typography>
                                                <Typography fontSize="1.5rem">
                                                    Final: {result.finalAmount} {result.toCurrency}
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default CheckEquivalency;
