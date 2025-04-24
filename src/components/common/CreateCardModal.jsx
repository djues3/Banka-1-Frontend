import React, {useEffect, useState} from "react";
import {Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Typography} from "@mui/material";
import {useCards} from "../../context/CardContext";
import {fetchAccountsId1} from "../../services/AxiosBanking";
import AuthorizedPersonModal from "./AuthorizedPersonModal";
import 'react-toastify/dist/ReactToastify.css';
import {useAuth} from "../../context/AuthContext";

const CreateCardModal = ({open, onClose,onSave, accountId}) => {
    const {addCard} = useCards();
    const [selectedAccount, setSelectedAccount] = useState("");
    const [selectedType, setSelectedType] = useState("DEBIT");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showSecuritiesModal, setShowSecuritiesModal] = useState(false);
    const [authorizedPerson, setAuthorizedPerson] = useState(null);
    const [company, setCompany] = useState(null);
    const {userInfo } = useAuth();
    const userId = userInfo.id;

    // Fetch available accounts when modal opens
    useEffect(() => {
        const loadAccounts = async () => {
            setLoading(true);
            try {

                if (userId) {
                    const accounts = await fetchAccountsId1(userId)
                    if (Array.isArray(accounts)) {
                        setAccounts(accounts);
                    }
                }
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
            setLoading(false);
        };

        if (open) loadAccounts().then();
    }, [open, accountId]);

    useEffect(() => {
        if (selectedAccount) {
            const selectedAcc = accounts.find(account => account.id === selectedAccount);
            if (selectedAcc) {
                setCompany(selectedAcc.company);
            }
        }
    }, [selectedAccount, accounts]);

    const handleCreateCard = async () => {
        if (!selectedAccount) return;

        try {

            const created = await addCard(selectedAccount, selectedType, selectedBrand,authorizedPerson, company);
            console.log("Is card Created = ", created)

            onSave(created);
            onClose();

            //neka stoji privremeno
            // window.location.reload();
        } catch (error) {
            console.error("Error creating card:", error);
        }
    };

    const isBusinessAccount = () =>{
        if(selectedAccount === "") return false;

        const selectedAcc = accounts.find(account => account.id ===selectedAccount)



        return selectedAcc.subtype === "BUSINESS";

    }

    const handleOpenAuthorizedPersonModal = () => {
        setShowSecuritiesModal(true);
    };
    const handleCloseAuthorizedPersonModal = () => {
        setShowSecuritiesModal(false);
    };

    const handleSaveAuthorizedPerson = (authorizedPerson) => {
        if(company){
            authorizedPerson.companyID = company.id;
        }
        setAuthorizedPerson(authorizedPerson)
    }

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "#1c1f2b",
                        color: "white",
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" sx={{mb: 2, textAlign: "center", fontWeight: "bold"}}>
                        Create new card
                    </Typography>

                    <FormControl fullWidth disabled={loading || accounts.length === 0}>
                        <InputLabel>Select account</InputLabel>
                        <Select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            displayEmpty
                         variant="outlined">
                            {accounts.length > 0 ? (
                                accounts.map((acc) => (
                                    <MenuItem key={acc.id} value={acc.id}>
                                        {acc.accountNumber}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No accounts available</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{my: 2}} disabled={loading || accounts.length === 0}>

                        <Select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            displayEmpty
                            disabled={true}
                            variant="outlined"
                            IconComponent={() => null}
                        >

                            <MenuItem key="DEBIT" value="DEBIT">Debit</MenuItem>
                        </Select>

                    </FormControl>

                    <FormControl fullWidth  disabled={loading || accounts.length === 0}>
                    <InputLabel>Choose card brand</InputLabel>
                    <Select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        displayEmpty
                        variant="outlined">
                        <MenuItem key="VISA" value="VISA">Visa</MenuItem>
                        <MenuItem key="MASTERCARD" value="MASTERCARD">Mastercard</MenuItem>
                    </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{my: 2}} disabled={selectedAccount === "" && isBusinessAccount()}>
                        {(selectedAccount !== "" && isBusinessAccount()) && (
                            <Button onClick={handleOpenAuthorizedPersonModal} >Authorized person</Button>
                        )}

                    </FormControl>




                    <Box sx={{display: "flex", justifyContent: "space-between", mt: 2}}>
                        <Button variant="contained" color="error" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleCreateCard} disabled={!selectedAccount}>
                            Confirm
                        </Button>
                    </Box>
                </Box>


            </Modal>
            <AuthorizedPersonModal open={showSecuritiesModal} onClose={handleCloseAuthorizedPersonModal} onSave={handleSaveAuthorizedPerson} />

        </>


    );
};

export default CreateCardModal;
