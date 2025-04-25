import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/mainComponents/Sidebar";
import { getUserIdFromToken } from "../../services/AxiosBanking";
import {
  createOrder,
  getTaxForUser,
  getUserSecurities,
  updatePublicCount,
} from "../../services/AxiosTrading";
import ProfitInfoModal from "../../components/common/ProfitInfoModal";
import TaxInfoModal from "../../components/common/TaxInfoModal";
import MakePublicModal from "../../components/common/MakePublicModal";

import {
  Box, Typography, Tabs, Tab, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Snackbar, Alert
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import styles from "../../styles/Transactions.module.css";
import SellModal from "../../components/common/SellModal";
import {toast, ToastContainer} from "react-toastify";

const PortfolioPage = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(0);
  const [portfolioData, setPortfolioData] = useState([]);
  const [taxData, setTaxData] = useState([]);
  const [profitModalOpen, setProfitModalOpen] = useState(false); 
  const [taxModalOpen, setTaxModalOpen] = useState(false); 
  const [makePublicOpen, setMakePublicOpen] = useState(false);
  const [selectedSecurity, setSelectedSecurity] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [availableSecurities, setAvailableSecurities] = useState(0);
  const [selectedSellSecurity, setselectedSellSecurity] = useState("");

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!userId) return;
      try {
        const data = await getUserSecurities(userId);
        console.log("data od securites: ", data);
        const tax = await getTaxForUser(userId);
        console.log(data)
        setPortfolioData(data);
        setTaxData(tax.data);
      } catch (error) {
        console.error("Error fetching user securities:", error);
      }
    };

    fetchPortfolio();
  }, [userId]);

  const handleOpenMakePublic = (security) => {
    setSelectedSecurity(security);
    setMakePublicOpen(true);
  };

  const handleCloseMakePublic = () => {
    setMakePublicOpen(false);
    setSelectedSecurity(null);
  };

  const handleConfirmMakePublic = async (count) => {
    try {
      const response = await updatePublicCount(selectedSecurity.portfolio_id, count);
      const updated = portfolioData.map((sec) =>
        sec.portfolio_id === selectedSecurity.portfolio_id ? { ...sec, public: count } : sec
      );
      setPortfolioData(updated);
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to update public count", error);
    } finally {
      handleCloseMakePublic();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("sr-RS");
  };

  const handleSellClick = (security) => {
    setIsSellModalOpen(true);
    //setAvailableSecurities(security.amount)
    setselectedSellSecurity(security)
  };

  const handleClose = () => {
    setIsSellModalOpen(false);
    setAvailableSecurities("")

  };

  const handleConfirmSell = async (amount, selectedAccount, userId, selectedSecurity) => {
    console.log("Selling amount:", amount + " to account: ", selectedAccount);

    const postRequest = {
      user_id: userId,
      account_id: selectedAccount,
      security_id: selectedSecurity.securityId,
      quantity: amount,
      contract_size: 1,
      direction: "sell",
      limit_price_per_unit: null,
      stop_price_per_unit: null,
      aon: false,
      margin: false
    }

    console.log(postRequest)
    try {
      const result = await createOrder(postRequest);
      console.log("Order created successfully:", result);
    } catch (error) {
      toast.error("Error creating order.", { autoClose: 3000 });

    }


    // handleClose();
  };

  return (
    <Box className={styles.page}>
      <Sidebar />
      <Box
        className={styles.container}
        sx={{
          backgroundColor: isDarkMode ? "#212128" : "#f1f1f1",
          height: "auto",
          overflowY: "auto",
          paddingBottom: 4,
        }}
      >
        <Typography variant="h5" className={styles.title}>
          My Portfolio
        </Typography>
  
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          className={styles.tabs}
        >
          <Tab label="All Securities" />
          <Tab label="Public Securities" />
        </Tabs>
  
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: isDarkMode ? "#2a2a3b" : "#fff",
            marginTop: 2,
            borderRadius: 2,
            boxShadow: "none",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Security</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Symbol</TableCell>
                {selectedTab === 0 && (
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                )}
                {/*<TableCell sx={{ fontWeight: "bold" }}>Purchase Price</TableCell>*/}
                {/*<TableCell sx={{ fontWeight: "bold" }}>Profit</TableCell>*/}
                <TableCell sx={{ fontWeight: "bold" }}>Last Modified</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Public</TableCell>
                {selectedTab === 0 && (
                  <>
                    <TableCell sx={{ fontWeight: "bold" }}>Make Public</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Sell</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolioData && portfolioData.length > 0 ? (
                portfolioData
                  .filter((row) => selectedTab === 0 || row.public > 0)
                  .map((row) => (
                    <TableRow key={row.portfolio_id}>
                      <TableCell>{row.type || "Stock"}</TableCell>
                      <TableCell>{row.ticker}</TableCell>

                      {selectedTab === 0 && (
                        <TableCell>{row.amount ?? 0}</TableCell>
                      )}

                      {/*<TableCell>{row.price?.toFixed(2) ?? "0.00"}</TableCell>*/}
                      {/*<TableCell sx={{ color: row.profit >= 0 ? "green" : "red" }}>*/}
                      {/*  {(row.profit ?? 0).toFixed(2)} USD*/}
                      {/*</TableCell>*/}
                      <TableCell>{formatDate(row.last_modified)}</TableCell>
                      <TableCell>{row.public ?? 0}</TableCell>

                      {selectedTab === 0 && (
                        <>
                          <TableCell>
                            {row.type === "Stock" && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleOpenMakePublic(row)}
                              >
                                Make Public
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleSellClick(row)}
                            >
                              Sell
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={9} sx={{textAlign: "center" }}>
                    No securities found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Box sx={{ marginTop: 2, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={() => setProfitModalOpen(true)}>
            Profit Info
          </Button>
          <Button variant="contained" color="primary" onClick={() => setTaxModalOpen(true)}>
            Tax Info
          </Button>
        </Box>
  
        <MakePublicModal
          open={makePublicOpen}
          onClose={handleCloseMakePublic}
          onConfirm={handleConfirmMakePublic}
          maxAmount={selectedSecurity?.amount ?? 0}
        />


  
        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Actions made public successfully!
          </Alert>
        </Snackbar>
  
        <SellModal
            isOpen={isSellModalOpen}
            onSave={handleConfirmSell}
            onClose={handleClose}
            selectedSecurity={selectedSellSecurity}

        />
        <ToastContainer position={"bottom-right"}></ToastContainer>


        <ProfitInfoModal 
          open={profitModalOpen} 
          onClose={() => setProfitModalOpen(false)}
          portfolioData={portfolioData}
        />
        { <TaxInfoModal
          open={taxModalOpen} 
          onClose={() => setTaxModalOpen(false)} 
          taxData={taxData}
        /> }
      </Box>
    </Box>

  );
  
};

export default PortfolioPage;
