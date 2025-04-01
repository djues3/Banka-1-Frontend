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
                maxWidth: '1200px',
                borderRadius: 4,
                boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
                p: 3,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <CardHeader
                title="Exchange Rates (Base: RSD)"
                sx={{
                    px: 0,
                    pb: 2,
                    fontWeight: 700,
                    typography: 'h4',
                }}
            />
            <CardContent sx={{ px: 0 }}>
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Currency</TableCell>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Buy</TableCell>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Middle</TableCell>
                                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 600 }}>Sell</TableCell>
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
                                    <TableRow key={currency} hover>
                                        <TableCell sx={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img
                                                src={`https://flagcdn.com/32x24/${flagCode}.png`}
                                                alt={`${currency} flag`}
                                                width="32"
                                                height="24"
                                                style={{ borderRadius: 4 }}
                                            />
                                            {currency}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{buy.toFixed(4)}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{rate.toFixed(4)}</TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem' }}>{sell.toFixed(4)}</TableCell>
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
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
                <Toolbar />
                <Container maxWidth="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error" sx={{ fontSize: '1.2rem' }}>
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