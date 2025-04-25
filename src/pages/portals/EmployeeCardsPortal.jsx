import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Grid,
  Button,
  Box,
  Select,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/mainComponents/Sidebar';
import {
  blockCard,
  changingAccountStatus,
  deactivateCard,
  fetchCardsByAccountId,
  updateCardStatus
} from '../../services/AxiosBanking';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardDisplay from '../../components/common/CreditCardDisplay';

const EmployeeCardsPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedAccount = location.state?.selectedAccount;
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);

  const handleBlock = async (row) => {
    try {
      await blockCard(row.id, !row.blocked);
      setCards(prev =>
        prev.map(r => (r.id === row.id ? { ...r, blocked: !r.blocked } : r))
      );
      toast.success('Blocked successfully');
    } catch (error) {
      toast.error(`Failed to update card status: ${error.message}`);
    }
  };

  const handleActive = async (row) => {
    if (!row.active) {
      toast.error("This card is permanently deactivated and cannot be reactivated.");
      return;
    }

    try {
      const newStatus = !row.active;
      // First deactivate the card
      await deactivateCard(row.id, newStatus);
      
      // If we're deactivating the card, also block it
      if (!newStatus) {
        await updateCardStatus(row.id, true);
      }
      
      setCards(prev =>
        prev.map(r => (r.id === row.id ? { 
          ...r, 
          active: newStatus,
          blocked: !newStatus // Set blocked to true when deactivating
        } : r))
      );
      toast.success("Card deactivated successfully");
    } catch (error) {
      toast.error(`Failed to update card status: ${error.response?.data?.error || error.message}`);
    }
  };

  const loadCards = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCardsByAccountId(selectedAccount.id);
      const rowData = data.data.cards;

      const formattedRows = rowData.map(row => ({
        id: row.id,
        cardNumber: maskCardNumber(row.cardNumber),
        firstName: selectedAccount.firstName,
        lastName: selectedAccount.lastName,
        active: row.active,
        cardLimit: row.cardLimit,
        blocked: row.blocked,
        companyID: selectedAccount.companyID ?? null,
        originalData: row
      }));

      setCards(formattedRows);

      // Ako je poslovni račun i postoji company info unutar kartice
      if (
        selectedAccount.accountType?.toLowerCase() === 'business' &&
        rowData.length > 0 &&
        rowData[0].account?.company
      ) {
        const comp = rowData[0].account.company;
        setCompany({
          name: comp.name,
          address: comp.address,
          pib: comp.vatNumber,
          companyRegistrationNumber: comp.companyNumber
        });
      }
    } catch (err) {
      toast.error('Failed to load cards data');
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (!selectedAccount) return;
    loadCards();
  }, [selectedAccount, loadCards]);

  const maskCardNumber = (cardNumber) => {
    return cardNumber.replace(/^(\d{4})\d{8}(\d{4})$/, '$1********$2');
  };

  const handleBack = () => navigate('/employee-bank-accounts-portal');

  const handleStatusChange = async (status) => {
    if (selectedAccount.status === 'CLOSED') {
      toast.error('Cannot change status of a closed account.');
      return;
    }

    try {
      await changingAccountStatus(selectedAccount.id, status);
      toast.success('Account status updated.');
      navigate('/employee-bank-accounts-portal');
    } catch {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div>
      <Sidebar />
      <Box sx={{ padding: '16px', marginTop: '64px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mr: 2, fontSize: '0.75rem' }}>
            Back to Accounts
          </Button>
        </Box>

        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          Cards for Account
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          {cards.map((card) => (
            <Grid item key={card.id}>
              <CreditCardDisplay
                card={card}
                onBlockToggle={handleBlock}
                onActiveToggle={handleActive}
              />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Account Details
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {[{ label: 'Account Number', value: selectedAccount.accountNumber },
            { label: 'First Name', value: selectedAccount.firstName },
            { label: 'Last Name', value: selectedAccount.lastName },
            { label: 'Account Type', value: selectedAccount.accountType },
            { label: 'Currency Type', value: selectedAccount.currencyType },
            { label: 'Status', isSelect: true }].map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  variant="outlined"
                  sx={{ height: 110, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                >
                  <CardContent sx={{ width: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    {item.isSelect ? (
                      <Select
                        fullWidth
                        value={selectedAccount.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        sx={{ mt: 1, fontSize: '0.9rem', fontWeight: 600 }}
                        disabled={selectedAccount.status === 'CLOSED'}
                      >
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                        <MenuItem value="CLOSED">CLOSED</MenuItem>
                      </Select>
                    ) : (
                      <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                        {item.value}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>

        {selectedAccount.accountType.toLowerCase() === 'business' && company && (
          <>
            <Typography variant="h6" align="center" sx={{ mt: 5, mb: 2 }}>
              Company Information
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {[{ label: 'Company Name', value: company.name },
                { label: 'Registration Number', value: company.companyRegistrationNumber },
                { label: 'PIB', value: company.pib }].map((item, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card
                      variant="outlined"
                      sx={{ height: 110, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                    >
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="body1" fontWeight={600} sx={{ mt: 0.5 }}>
                          {item.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </div>
  );
};

export default EmployeeCardsPortal;
