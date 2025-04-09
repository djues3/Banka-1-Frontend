import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    CssBaseline,
    Grid,
    Card,
    CardActionArea,
    CardContent
} from '@mui/material';
import LogoutButton from '../../components/common/LogoutButton';

// ICONS
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FolderIcon from '@mui/icons-material/Folder';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GavelIcon from '@mui/icons-material/Gavel';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BarChartIcon from '@mui/icons-material/BarChart';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const HomePage = () => {
    const [roleMessage, setRoleMessage] = useState('');
    const [cards, setCards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const { isAdmin, isEmployed, department, position } = decodedToken;

                const items = [];

                const addCard = (label, route, icon) =>
                    items.push({ label, route, icon });

                if (isAdmin) {
                    setRoleMessage('Welcome to the Admin Dashboard');
                    addCard('Employees', '/employee-portal', PeopleIcon);
                }

                if (isEmployed && department === 'SUPERVISOR') {
                    setRoleMessage('Welcome to the Supervisor Dashboard');
                    addCard('Home', '/employee-home', HomeIcon);
                    addCard('Actuarial Management', '/actuarial-management-portal', CompareArrowsIcon);
                    addCard('Actuarial Performance', '/actuarial-performance-portal', ReceiptIcon);
                    addCard('Portfolio', '/portfolio-page', LibraryBooksIcon);
                    addCard('Important Files', '/actuary-buying-portal', FolderIcon);
                    addCard('Orders', '/view-order-portal', ShoppingCartIcon);
                    addCard('Tax Tracking', '/tax-tracking-portal', BarChartIcon);
                } else if (isEmployed && department === 'AGENT') {
                    setRoleMessage('Welcome to the Agent Dashboard');
                    addCard('Home', '/employee-home', HomeIcon);
                    addCard('Portfolio', '/portfolio-page', LibraryBooksIcon);
                    addCard('Important Files', '/actuary-buying-portal', FolderIcon);
                } else if (isEmployed && department !== 'AGENT' && department !== 'SUPERVISOR') {
                    setRoleMessage('Welcome to the Employee Dashboard');
                    addCard('Home', '/employee-home', HomeIcon);
                    addCard('Customers', '/customer-portal', PeopleIcon);
                    addCard('Bank Accounts', '/employee-bank-accounts-portal', AccountBalanceIcon);
                    addCard('All Loans', '/all-loans-employee', ReceiptIcon);
                    addCard('Pending Loans', '/pending-loans-employee', PaymentIcon);
                    addCard('Companies', '/companies-portal', BusinessIcon);
                } else if (position === 'NONE') {
                    setRoleMessage('Welcome to the Customer Dashboard');
                    addCard('Home', '/customer-home', HomeIcon);
                    addCard('Accounts', '/accounts-portal', AccountBalanceIcon);
                    addCard('New Payment', '/new-payment-portal', PaymentIcon);
                    addCard('Transfer', '/internal-transfer-portal', CompareArrowsIcon);
                    addCard('Payment Receivers', '/receiver-portal', PersonAddIcon);
                    addCard('Payment Overview', '/transactions-page', ReceiptIcon);
                    addCard('Exchange Rates', '/exchange-rates', CurrencyExchangeIcon);
                    addCard('Currency Converter', '/currency-converter', CompareArrowsIcon);
                    addCard('Cards', '/cards-portal', CreditCardIcon);
                    addCard('Loans', '/loans-portal', CurrencyExchangeIcon);
                    addCard('Important Files', '/client-buying-portal', FolderIcon);
                    addCard('Portfolio', '/portfolio-page', LibraryBooksIcon);
                    addCard('OTC Trading', '/otc-trading-portal', ShoppingCartIcon);
                    addCard('OTC Offers', '/otc-active-offers', GavelIcon);
                    addCard('OTC Contracts', '/otc-contracts', HandshakeIcon);
                } else {
                    setRoleMessage('Unauthorized Access');
                }

                const filteredItems = items.filter(
                    item => item.route !== '/employee-home' && item.route !== '/customer-home'
                );

                setCards(filteredItems);
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>

                    </Typography>
                    <LogoutButton />
                </Toolbar>
            </AppBar>

            {/* Main content */}
            <Box sx={{ flexGrow: 1, padding: 3, marginTop: '80px' }}>
                <Typography variant="h4" gutterBottom>
                    {roleMessage}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please select a section below.
                </Typography>

                <Grid container spacing={3} sx={{ mt: 3 }}>
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    elevation={4}
                                    sx={{
                                        height: 200,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 3,
                                        backgroundColor: 'background.paper',
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: 6
                                        }
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => navigate(card.route)}
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 2,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Icon sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="h6">{card.label}</Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage;