import AccountSlider from "../../components/accountComponent/AccountSlider";
import React, {use, useEffect, useState} from "react";
import {Box, Card, CardContent, Container, Typography} from "@mui/material";
import {fetchAccountsId1, getUserIdFromToken} from "../../services/AxiosBanking";
import CircularProgress from "@mui/material/CircularProgress";
import FastPayments from "../../components/transactionComponents/FastPayments";
import RecentTransactions from "../../components/transactionComponents/RecentTransations";
import Sidebar from "../../components/mainComponents/Sidebar";
import CardSection from "../../components/CustomerHomePageComponent/AccountCardSection";
import AccountCard from "../../components/CustomerHomePageComponent/AccountSliderCardComponent";
import {fetchCustomerById} from "../../services/AxiosUser";
import {useAuth} from "../../context/AuthContext";


const CustomerAccountPortal = () =>{

    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [user, setUser] = useState(null);
    const {userInfo} = useAuth();
    const userId = userInfo.id;

    useEffect(() => {
        const loadAccountsAndUser = async () => {
            if (userId) {
                try {
                    // Učitavanje računa
                    const fetchedAccounts = await fetchAccountsId1(userId);
                    setAccounts(fetchedAccounts || []);
                    if (fetchedAccounts && fetchedAccounts.length > 0) {
                        setSelectedAccountId(fetchedAccounts[0].id);
                    }

                    // Učitavanje korisnika
                    const response = await fetchCustomerById(userId);
                    setUser(response.data);
                } catch (error) {
                    console.error("Error loading data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadAccountsAndUser().then();
    }, []);

    //dok se ucitava circular progress se vidi
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }


    return (
        <Container disableGutters maxWidth={true}>
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />

                <Box sx={{ flexGrow: 1, p: 3 }}>
                    {/* Gornji deo - Account kartice */}
                    <Box sx={{ marginTop: "5%", width: "100%" }}>
                        <CardSection accounts={accounts} onSelectAccount={setSelectedAccountId} user={user} />
                    </Box>

                    {/* Donji deo - FastPayments levo, Tabela desno */}
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 3, mt: 4 }}>
                        {/* Leva strana - FastPayments */}
                        <Box sx={{ flex: 1 }}>
                            <FastPayments  />
                        </Box>

                        {/* Desna strana - RecentTransactions */}
                        <Box sx={{ flex: 2 }}>
                            <RecentTransactions accountId={selectedAccountId} />

                        </Box>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default CustomerAccountPortal;
// // <Container>
// {/*<Sidebar></Sidebar>*/}
// {/*/!* Naslov *!/*/}
// {/*<Typography variant="h4" sx={{textAlign: "center", marginBottom: "20px", color: "white"}}>*/}
// {/*    Client Account Portal*/}
// {/*</Typography>*/}
//
// {/*/!* Slider za račune, prosledjuju se racuni i koji je trenutno aktuelan racun *!/*/}
{/*<AccountSlider accounts={accounts} onAccountChange={setSelectedAccountId}/>*/}
//
// {/*/!* Brza plaćanja*!/*/}
// {/*<Card sx={{marginTop: 4, backgroundColor: "#1e1e2e", color: "white"}}>*/}
// {/*    <CardContent>*/}
// {/*        <FastPayments accountId={selectedAccountId}/>*/}
// {/*    </CardContent>*/}
// {/*</Card>*/}
//
// {/*/!* Poslednje transakcije, prosledjuje se koji je aktuelan account *!/*/}
// {/*{selectedAccountId && (*/}
// {/*    <Card sx={{marginTop: 4, backgroundColor: "#18181f", color: "white"}}>*/}
// {/*        <CardContent>*/}
// {/*            <RecentTransactions accountId={selectedAccountId}/>*/}
// {/*        </CardContent>*/}
// {/*    </Card>*/}
// {/*)}*/}
// {/*</Container>*/}