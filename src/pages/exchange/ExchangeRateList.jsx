import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
    Card,
    CardHeader,
    CardContent,
    CircularProgress,
    Alert,
    Box,
    Toolbar,
    Typography,
    useTheme
} from '@mui/material';
import { fetchExchangeRates } from '../../services/AxiosBanking';
import Sidebar from '../../components/mainComponents/Sidebar';

const currencyToFlagCode = {
    EUR: 'eu',
    USD: 'us',
    GBP: 'gb',
    CHF: 'ch',
    JPY: 'jp',
    CAD: 'ca',
    AUD: 'au',
};

const ExchangeRateList = () => {
    const theme = useTheme();
    const [exchangeRates, setExchangeRates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const supportedCurrencies = ['EUR', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD'];

    useEffect(() => {
        const loadExchangeRates = async () => {
            try {
                const response = await fetchExchangeRates();
                setExchangeRates(response.data.rates);
            } catch (err) {
                setError('Failed to fetch exchange rates. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadExchangeRates();
    }, []);

    const renderTable = () => (
        <Card
            sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: '800px', md: '1100px' },
                borderRadius: 3,
                boxShadow: 3,
                p: { xs: 2.5, sm: 4 },
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <CardHeader
                title={
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Exchange Rates
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <Typography variant="body2" color="text.secondary" fontSize="0.95rem">
                                All values are expressed in RSD
                            </Typography>
                            <img
                                src="https://flagcdn.com/24x18/rs.png"
                                alt="RSD flag"
                                width="24"
                                height="18"
                                style={{ borderRadius: 2 }}
                            />
                        </Box>
                    </Box>
                }
                sx={{ px: 0, pb: 2 }}
            />
            <CardContent sx={{ px: 0 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none' }}>
                    <Table size="medium" sx={{ borderCollapse: 'collapse' }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                                <TableCell sx={{ fontSize: '1.05rem', fontWeight: 600 }}>Currency</TableCell>
                                <TableCell sx={{ fontSize: '1.05rem', fontWeight: 600, textAlign: 'center' }}>Buy</TableCell>
                                <TableCell sx={{ fontSize: '1.05rem', fontWeight: 600, textAlign: 'center' }}>Middle</TableCell>
                                <TableCell sx={{ fontSize: '1.05rem', fontWeight: 600, textAlign: 'center' }}>Sell</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {supportedCurrencies.map((currency) => {
                                const rate = exchangeRates?.[currency];
                                if (!rate) return null;

                                const buy = rate * 0.99;
                                const sell = rate * 1.01;
                                const flagCode = currencyToFlagCode[currency];

                                return (
                                    <TableRow key={currency} hover sx={{ borderBottom: 'none' }}>
                                        <TableCell
                                            sx={{
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.2,
                                                borderBottom: 'none',
                                            }}
                                        >
                                            <img
                                                src={`https://flagcdn.com/24x18/${flagCode}.png`}
                                                alt={`${currency} flag`}
                                                width="24"
                                                height="18"
                                                style={{ borderRadius: 3 }}
                                            />
                                            {currency}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: '1rem',
                                                textAlign: 'center',
                                                borderBottom: 'none',
                                            }}
                                        >
                                            {buy.toFixed(4)}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: '1rem',
                                                textAlign: 'center',
                                                borderBottom: 'none',
                                            }}
                                        >
                                            {rate.toFixed(4)}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: '1rem',
                                                textAlign: 'center',
                                                borderBottom: 'none',
                                            }}
                                        >
                                            {sell.toFixed(4)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );

    return (
        <>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Toolbar />
                <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error" sx={{ fontSize: '1rem' }}>
                            {error}
                        </Alert>
                    ) : (
                        renderTable()
                    )}
                </Container>
            </Box>
        </>
    );
};

export default ExchangeRateList;