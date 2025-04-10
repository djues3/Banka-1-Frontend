import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Toolbar,
} from "@mui/material";
import {getActiveOffers, acceptOffer, rejectOffer} from "../../services/AxiosTrading";
import CounterOfferModal from "../../components/common/CounterOfferModal";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../../components/mainComponents/Sidebar";

const ActiveOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);

  const loadOffers = async () => {
    try {
      const res = await getActiveOffers();
      setOffers(res.data || []);
    } catch (error) {
      console.error("Greška pri učitavanju aktivnih ponuda:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
    loadOffers();
  }, []);

  const handleCounterOffer = (offer) => {
    setSelectedOffer(offer);
    setIsCounterModalOpen(true);
  };

  const handleCloseCounterModal = (shouldRefresh) => {
    setIsCounterModalOpen(false);
    setSelectedOffer(null);
    if (shouldRefresh) {
      loadOffers();
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await acceptOffer(offerId);
      await loadOffers();
    } catch (error) {
      console.error("Greška pri prihvatanju ponude:", error);
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      await rejectOffer(offerId);
      await loadOffers();
    } catch (error) {
      console.error("Greška pri prihvatanju ponude:", error);
    }
  };

  const getPriceColor = (pricePerUnit, lastPrice) => {
    if (!lastPrice) return "default";
    const diff = Math.abs((pricePerUnit - lastPrice) / lastPrice);
    if (diff <= 0.05) return "success";
    if (diff <= 0.2) return "warning";
    return "error";
  };

  const sellerOffers = offers.filter((o) => o.SellerID === userId);
  const buyerOffers = offers.filter((o) => o.BuyerID === userId);

  const renderOffers = (title, offerList, role) => (
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {offerList.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
              You have no active offers as a {role}.
            </Typography>
        ) : (
            <Grid container spacing={3}>
              {offerList.map((offer) => {
                const security = offer.portfolio?.security || {};
                const isLastModifiedByUser = offer.ModifiedBy === userId;
                const canInteract = !isLastModifiedByUser;
                const priceColor = getPriceColor(offer.PricePerUnit, security.lastPrice);
                const isUnread = !isLastModifiedByUser;

                return (
                    <Grid item xs={12} sm={6} md={4} key={offer.ID}>
                      <Card variant="outlined" sx={{ height: "100%" }}>
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h6">
                              {security.ticker} - {security.name}
                            </Typography>
                            {isUnread && <Chip label="New" color="info" size="small" />}
                          </Box>
                          <Divider sx={{ my: 1 }} />
                          <Typography><strong>Quantity:</strong> {offer.Quantity}</Typography>
                          <Typography>
                            <strong>Price per unit:</strong>{" "}
                            <Chip
                                label={`$${offer.PricePerUnit}`}
                                color={priceColor}
                                variant="outlined"
                                size="small"
                            />
                          </Typography>
                          <Typography><strong>Premium:</strong> ${offer.Premium}</Typography>
                          <Typography>
                            <strong>Settlement date:</strong>{" "}
                            {new Date(offer.SettlementAt).toLocaleDateString()}
                          </Typography>

                          <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                disabled={!canInteract}
                                onClick={() => handleCounterOffer(offer)}
                            >
                              Counter Offer
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                disabled={!canInteract}
                                onClick={() => handleAcceptOffer(offer.ID)}
                            >
                              Accept Offer
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                disabled={!canInteract}
                                onClick={() => handleRejectOffer(offer.ID)}
                            >
                              Cancel Offer
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                );
              })}
            </Grid>
        )}
      </Box>
  );

  return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Toolbar />
          <Typography variant="h4" gutterBottom>
            Active Offers
          </Typography>

          {renderOffers("As seller", sellerOffers, "seller")}
          {renderOffers("As buyer", buyerOffers, "buyer")}

          <CounterOfferModal
              open={isCounterModalOpen}
              onClose={handleCloseCounterModal}
              offer={selectedOffer}
          />
        </Box>
      </Box>
  );
};

export default ActiveOffersPage;
