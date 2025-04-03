import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import PaymentIcon from "@mui/icons-material/Payment";
import "../../styles/AccountCard.css";
import AccountDetailsModal from "../common/AccountDetailsModal";
import {useNavigate} from "react-router-dom";

const AccountCard = ({ account, isSelected, onClick }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const navigate = useNavigate();


    const isDarkMode = theme.palette.mode === "dark";

    const open = Boolean(anchorEl);
    const handleMenuClick = (event) => {
        event.stopPropagation(); // da ne pokrene onClick iz roditelja
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDetails = () => {
        setAnchorEl(null);
        setSelectedAccount(account);
        setIsModalOpen(true);
    };
    const formatString = (input) => {
        if (!input) return "";

        return input
            .replace(/_/g, " ")                      // zameni _ sa space
            .toLowerCase()                           // sve mala slova
            .replace(/\b\w/g, char => char.toUpperCase()); // svako prvo slovo u reči veliko
    };

    return (
        <Card
            variant="outlined"
            onClick={onClick}
            sx={{
                border: isSelected ? "4px solid #7256d6" : "1px solid #333",
                borderRadius: "2.25rem",
                transition: "all 0.3s ease",
                cursor: "pointer",
                minWidth: 280,
                textAlign: "center",
                overflow: "hidden",
                color: isDarkMode ? "#ddd" : "#222",
                background: isDarkMode
                    ? "linear-gradient(45deg, #232228, #232228, #595992)"
                    : "linear-gradient(45deg, #4b5563, #e0e0e0, #595992)",
                boxShadow: "1px 12px 25px rgba(0, 0, 0, 0.78)",
                transform: isSelected ? "scale(1.015)" : "scale(1)",
                "&:hover": {
                    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.7)",
                    transform: "scale(1.015)",
                    background: isDarkMode
                        ? "linear-gradient(45deg, #aaa, #595992, #595992)"
                        : "linear-gradient(45deg, #ddd, #bbb, #595992)",
                },
            }}
            className={isSelected ? "selected" : ""}
        >
            <CardHeader
                title={<Typography variant="subtitle1">{formatString(account.type) + " - " + formatString(account.subtype)}</Typography>}
                action={
                    <>
                        <IconButton onClick={handleMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                        >
                            <MenuItem onClick={handleDetails}>Details</MenuItem>

                        </Menu>
                    </>
                }
            />

            <CardContent>
                <Typography variant="h5" fontWeight="bold">
                    {account.balance + " " + account.currencyType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {account.accountNumber}
                </Typography>
            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "space-between", px: 2, pb: 2 }}>
                <IconButton color="primary">
                    <AddIcon />
                </IconButton>
                <Button
                    variant="contained"
                    startIcon={<PaymentIcon />}
                    sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        backgroundColor: "#7256d6",
                        "&:hover": { backgroundColor: "#7f5cf8" },
                    }}
                    onClick={() =>
                        navigate("/new-payment-portal", {
                            state: {
                                payerAccountNumber: account.accountNumber,
                            },
                        })
                    }

                >
                    New payment
                </Button>
            </CardActions>
            <AccountDetailsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                account={selectedAccount}
            />
        </Card>
    );
};

export default AccountCard;
