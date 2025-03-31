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
  fetchCompany
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
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);

  const handleBlock = async (row) => {
    try {
      await blockCard(row.id, !row.blocked);
      setCards(prev =>
          prev.map(r =>
              r.id === row.id ? { ...r, blocked: !r.blocked } : r
          )
      );
      toast.success('Blocked successfully');
    } catch (error) {
      console.error("Error updating card status:", error);
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
      await deactivateCard(row.id, newStatus);
      setCards(prev =>
          prev.map(r =>
              r.id === row.id ? { ...r, active: newStatus } : r
          )
      );
      toast.success("Card deactivated successfully");
    } catch (error) {
      console.error("Error updating card status:", error);
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
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Failed to load cards data');
      toast.error('Failed to load cards data');
    } finally {
      setLoading(false);
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (!selectedAccount) {
      setError('No account selected. Please select an account from the accounts list.');
      setLoading(false);
      return;
    }
    loadCards();
    if (selectedAccount?.accountType?.toLowerCase() === 'business') {
      if (selectedAccount.companyID) {
        loadCompanyInfo(selectedAccount.companyID);
      }
    }
  }, [selectedAccount, loadCards]);

  const loadCompanyInfo = async (companyId) => {
    try {
      const response = await fetchCompany(companyId);
      setCompany(response.company);
    } catch (err) {
      console.error('Failed to load company info:', err);
      toast.error('Failed to load company info');
    }
  };

  function maskCardNumber(cardNumber) {
    return cardNumber.replace(/^(\d{4})\d{8}(\d{4})$/, '$1********$2');
  }

  const handleBack = () => {
    navigate('/employee-bank-accounts-portal');
  };

  const handleStatusChange = async (status) => {
    try {
      await changingAccountStatus(selectedAccount.id, status);
      toast.success('Account status updated successfully.');
      navigate('/employee-bank-accounts-portal');
    } catch {
      toast.error('Account status failed.');
    }
  };

  return (
      <div>
        <Sidebar />
        <div style={{ padding: '20px', marginTop: '64px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
              Back to Accounts
            </Button>
          </Box>

          <Typography
              variant="h2"
              align="center"
              sx={{ fontWeight: 'bold', mb: 4 }}
          >
            Cards for Account
          </Typography>

          <Grid container spacing={3} justifyContent="center" sx={{ mb: 8, mt: 8 }}>
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

          <Typography variant="h3" sx={{ mb: 8, textAlign: 'center' }}>
            Account Details
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {[
              { label: 'Account Number', value: selectedAccount.accountNumber },
              { label: 'First Name', value: selectedAccount.firstName },
              { label: 'Last Name', value: selectedAccount.lastName },
              { label: 'Account Type', value: selectedAccount.accountType },
              { label: 'Currency Type', value: selectedAccount.currencyType }
            ].map((item, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card variant="outlined" sx={{ height: '100%', textAlign: 'center' }}>
                    <CardContent
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%'
                        }}
                    >
                      <Typography variant="h6" color="text.secondary">{item.label}</Typography>
                      <Typography variant="h5" fontWeight={600}>{item.value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
            ))}

            <Grid item xs={12} sm={6} md={4}>
              <Card variant="outlined" sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%'
                    }}
                >
                  <Typography variant="h6" color="text.secondary">Status</Typography>
                  <Select
                      fullWidth
                      value={selectedAccount.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      sx={{ mt: 1, fontSize: '1.25rem', fontWeight: 600 }}
                  >
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="BLOCKED">BLOCKED</MenuItem>
                    <MenuItem value="CLOSED">CLOSED</MenuItem>
                    <MenuItem value="FROZEN">FROZEN</MenuItem>
                  </Select>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {selectedAccount.accountType.toLowerCase() === 'business' && company && (
              <>
                <Typography variant="h5" sx={{ mt: 5, mb: 2, textAlign: 'center' }}>
                  Company Information
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                  {[
                    { label: 'Company Name', value: company.name },
                    { label: 'Registration Number', value: company.companyRegistrationNumber },
                    { label: 'PIB', value: company.pib },
                    { label: 'Address', value: company.address }
                  ].map((item, idx) => (
                      <Grid item xs={12} sm={6} md={3} key={idx}>
                        <Card variant="outlined" sx={{ textAlign: 'center' }}>
                          <CardContent>
                            <Typography variant="h6" color="text.secondary">{item.label}</Typography>
                            <Typography variant="h5" fontWeight={600}>{item.value}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                  ))}
                </Grid>
              </>
          )}

        </div>

      </div>


  );
};

export default EmployeeCardsPortal;