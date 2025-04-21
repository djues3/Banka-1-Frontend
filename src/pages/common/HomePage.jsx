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
    Paper
} from '@mui/material';
import LogoutButton from '../../components/common/LogoutButton';
import { getAgents, getUserSecurities } from '../../services/AxiosTrading';

// ICONS
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
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

const HomePage = () => {
    const [roleMessage, setRoleMessage] = useState('');
    const [cards, setCards] = useState([]);
    const [agentStats, setAgentStats] = useState({ profit: 0, limit: 0, usedLimit: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const isAdmin = decodedToken.isAdmin;
                const isEmployed = decodedToken.isEmployed;
                const department = decodedToken.department || null;
                const position = decodedToken.position || null;

                const items = [];
                const addCard = (label, route, icon) =>
                    items.push({ label, route, icon });

                // Admin
                if (isAdmin) {
                    setRoleMessage('Welcome to the Admin Dashboard');
                    addCard('Employees', '/employee-portal', PeopleIcon);
                    addCard('Customers', '/customer-portal', PeopleIcon);
                    addCard('Bank Accounts', '/employee-bank-accounts-portal', AccountBalanceIcon);
                    addCard('All Loans', '/all-loans-employee', ReceiptIcon);
                    addCard('Pending Loans', '/pending-loans-employee', AttachMoneyIcon);
                    addCard('Companies', '/companies-portal', CorporateFareIcon);
                    addCard('Bank Performance', '/bank-performance-portal',  LocalAtmIcon);
                
                }

                // Supervisor
                else if (isEmployed && department === 'SUPERVISOR') {
                    setRoleMessage('Welcome to the Supervisor Dashboard');
                    addCard('Agent Management', '/agent-management-portal', CompareArrowsIcon);
                    addCard('Actuarial Performance', '/actuarial-performance-portal', PriceCheckIcon);
                    addCard('Portfolio', '/portfolio-page', LibraryBooksIcon);
                    addCard('Important Files', '/actuary-buying-portal', FolderIcon);
                    addCard('Orders', '/view-order-portal', ShoppingCartIcon);
                    addCard('Tax Tracking', '/tax-tracking-portal', BarChartIcon);
                }

                // Agent
                else if (isEmployed && department === 'AGENT') {
                    setRoleMessage('Welcome to the Agent Dashboard');
                    addCard('Portfolio', '/portfolio-page', LibraryBooksIcon);
                    addCard('Important Files', '/actuary-buying-portal', FolderIcon);
                    
                    // Fetch agent stats
                    const fetchAgentStats = async () => {
                        try {
                            // Get all agents and find the current one
                            const agentsResponse = await getAgents();
                            console.log("Agents response:", agentsResponse); // Debug log
                            if (agentsResponse && agentsResponse.data) {
                                const currentAgent = agentsResponse.data.find(agent => agent.userId === decodedToken.id);
                                console.log("Current agent:", currentAgent); // Debug log
                                if (currentAgent) {
                                    setAgentStats(prev => ({
                                        ...prev,
                                        limit: currentAgent.limit || 0,
                                        usedLimit: currentAgent.usedLimit || 0
                                    }));
                                }
                            }

                            // Get agent's portfolio and calculate profit
                            const portfolioResponse = await getUserSecurities(decodedToken.id);
                            if (portfolioResponse && Array.isArray(portfolioResponse)) {
                                const totalProfit = portfolioResponse.reduce((acc, security) => acc + security.profit, 0);
                                setAgentStats(prev => ({
                                    ...prev,
                                    profit: totalProfit
                                }));
                            }
                        } catch (error) {
                            console.error('Error fetching agent stats:', error);
                        }
                    };
                    fetchAgentStats();
                }

                // Regular Employee
                else if (isEmployed && department !== 'AGENT' && department !== 'SUPERVISOR') {
                    setRoleMessage('Welcome to the Employee Dashboard');
                    addCard('Customers', '/customer-portal', PeopleIcon);
                    addCard('Bank Accounts', '/employee-bank-accounts-portal', AccountBalanceIcon);
                    addCard('All Loans', '/all-loans-employee', ReceiptIcon);
                    addCard('Pending Loans', '/pending-loans-employee', AttachMoneyIcon);
                    addCard('Companies', '/companies-portal', BusinessIcon);
                }

                // Customer
                else if (position === 'NONE') {
                    setRoleMessage('Welcome to the Customer Dashboard');
                    addCard('Accounts', '/accounts-portal', AccountBalanceIcon);
                    addCard('New Payment', '/new-payment-portal', PaymentIcon);
                    addCard('Transfer', '/internal-transfer-portal', CompareArrowsIcon);
                    addCard('Payment Receivers', '/receiver-portal', PersonAddIcon);
                    addCard('Payment Overview', '/transactions-page', ReceiptIcon);
                    addCard('Exchange Rates', '/exchange-rates', MonetizationOnIcon);
                    addCard('Currency Converter', '/currency-converter', CompareArrowsIcon);
                    addCard('Cards', '/cards-portal', CreditCardIcon);
                    addCard('Loans', '/loans-portal', CurrencyExchangeIcon);
                    addCard('Important Files', '/client-buying-portal', FolderIcon);
                    addCard('Portfolio', '/portfolio-page', LibraryBooksIcon);
                    addCard('OTC Trading', '/otc-trading-portal', ShoppingCartIcon);
                    addCard('OTC Offers', '/otc-active-offers', GavelIcon);
                    addCard('OTC Contracts', '/otc-contracts', HandshakeIcon);
                }

                setCards(items);
            } catch (error) {
                console.error('Invalid token', error);
            }
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
                    <LogoutButton />
                </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1, padding: 3, marginTop: '80px' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {roleMessage}
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    Please select a section below.
                </Typography>

                {/* Agent Stats Display */}
                {roleMessage === 'Welcome to the Agent Dashboard' && (
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    backgroundColor: 'background.paper',
                                    borderRadius: 2,
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <Typography variant="subtitle1" color="text.secondary">
                                    Current Profit
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: agentStats.profit >= 0 ? 'success.main' : 'error.main',
                                        fontWeight: 'bold',
                                        mt: 1
                                    }}
                                >
                                    {agentStats.profit.toFixed(2)} USD
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    backgroundColor: 'background.paper',
                                    borderRadius: 2,
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <Typography variant="subtitle1" color="text.secondary">
                                    Trading Limit
                                </Typography>
                                <Typography
                                    variant="h5"
                                    color="primary"
                                    sx={{ fontWeight: 'bold', mt: 1 }}
                                >
                                    {agentStats.usedLimit.toLocaleString('sr-RS')} / {agentStats.limit.toLocaleString('sr-RS')} USD
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

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