import React, {useEffect, useMemo, useState} from "react";
import {
    Button,
    TextField,
    ButtonGroup,
    IconButton,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import {fetchAvailableSecurities, fetchSecurities, updateSecurity} from "../../services/AxiosTrading";
import DataTable from "../tables/DataTable";
import SecuritiesModal from "../common/SecuritiesModal";

const SecuritiesTable = ({ role }) => {
    const [securities, setSecurities] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [askRange, setAskRange] = useState({ min: "", max: "" });
    const [bidRange, setBidRange] = useState({ min: "", max: "" });
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [volumeRange, setVolumeRange] = useState({ min: "", max: "" });
    const [settlementDate, setSettlementDate] = useState("");
    const [exchangeFilter, setExchangeFilter] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            await loadSecurities().catch((error) => console.error("Greška pri učitavanju", error));
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);

        return () => clearInterval(interval);
    }, []);


    const loadSecurities = async () => {
        try {
            const allSecurities = await fetchSecurities();
            const availableSecurities = await fetchAvailableSecurities();

            // Mapa dostupnih hartija za kupovinu
            const availableMap = new Map(availableSecurities.map(sec => [sec.ticker, sec.availableQuantity]));

            // Računamo `change` i `initialMarginCost`
            const mergedSecurities = allSecurities.map(sec => {
                // Računanje `change`
                const change = sec.previousClose
                    ? (((sec.lastPrice - sec.previousClose) / sec.previousClose) * 100).toFixed(2) + "%"
                    : "N/A";

                // Računanje `maintenanceMargin` zavisno od tipa
                let maintenanceMargin = 0;
                if (sec.type === "stock") {
                    maintenanceMargin = sec.lastPrice * 0.5;
                } else if (sec.type === "forex") {
                    maintenanceMargin = sec.contractSize * sec.lastPrice * 0.1;
                } else if (sec.type === "future") {
                    maintenanceMargin = sec.contractSize * sec.lastPrice * 0.1;
                } else if (sec.type === "option") {
                    maintenanceMargin = 100 * sec.lastPrice * 0.5;
                }

                // Računanje `initialMarginCost`
                const initialMarginCost = (maintenanceMargin * 1.1).toFixed(2);

                return {
                    ...sec,
                    availableForPurchase: availableMap.get(sec.ticker) || 0,
                    change,
                    initialMarginCost
                };
            });

            setSecurities(mergedSecurities);
        } catch (error) {
            console.error("Neuspešno učitavanje podataka o hartijama", error);
        }
    };


    const handleUpdate = async (ticker) => {
        try {
            await updateSecurity(ticker, { lastPrice: Math.random() * 100 });
            loadSecurities(); // Osveži listu
        } catch (error) {
            console.error("Greška pri osvežavanju hartije");
        }
    };


    // Filtriramo hartije na osnovu uloge i tipa koji je korisnik izabrao
    const filteredSecurities = useMemo(() => {
        return securities.filter(sec => {
            const matchesRole = role === "client" ? ["stock", "future"].includes(sec.type) : sec.type !== "bond";
            const matchesType = selectedType === "all" || sec.type === selectedType;
            const matchesSearch = sec.ticker.toLowerCase().includes(search.toLowerCase()) || sec.name.toLowerCase().includes(search.toLowerCase());
            const matchesExchange = exchangeFilter ? sec.exchange.toLowerCase().startsWith(exchangeFilter.toLowerCase()) : true;

            const matchesAsk = askRange.min === "" || askRange.max === "" || (sec.ask >= parseFloat(askRange.min) && sec.ask <= parseFloat(askRange.max));
            const matchesBid = bidRange.min === "" || bidRange.max === "" || (sec.bid >= parseFloat(bidRange.min) && sec.bid <= parseFloat(bidRange.max));
            const matchesPrice = priceRange.min === "" || priceRange.max === "" || (sec.lastPrice >= parseFloat(priceRange.min) && sec.lastPrice <= parseFloat(priceRange.max));
            const matchesVolume = volumeRange.min === "" || volumeRange.max === "" || (sec.availableQuantity >= parseFloat(volumeRange.min) && sec.availableQuantity <= parseFloat(volumeRange.max));

            const matchesSettlementDate = settlementDate ? (sec.settlementDate && sec.settlementDate.startsWith(settlementDate)) : true;

            return matchesRole && matchesType && matchesSearch && matchesExchange && matchesAsk && matchesBid && matchesPrice && matchesVolume && matchesSettlementDate;
        });
    }, [securities, selectedType, search, exchangeFilter, askRange, bidRange, priceRange, volumeRange, settlementDate, role]);


    const columns = [
        { field: "ticker", headerName: "Ticker", width: 180 },
        { field: "lastPrice", headerName: "Cena", width: 180, type: "number" },
        { field: "change", headerName: "Promena", width: 180, type: "number" },
        { field: "availableQuantity", headerName: "Volumen", width: 160, type: "number" },
        {
            field: "initialMarginCost",
            headerName: "Initial Margin Cost",
            width: 200,
            type: "number",
           // valueGetter: (params) => (params.row.maintenanceMargin ? (params.row.maintenanceMargin * 1.1).toFixed(2) : "N/A")
        },
        { field: "actions", headerName: "Akcije", width: 200, renderCell: (params) => (
                <>
                    {params.row.availableForPurchase > 0 && ( /*Treba da se zove dunjin BuyModal */
                        <Button variant="outlined" onClick={() => console.log("Kupi", params.row)}>Kupi</Button>
                    )}
                </>
            )}
    ];

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const openDetailsModal = () => {
        setIsDetailsModalOpen(true);
    }
    const closeDetailsModal =() => {
        setIsDetailsModalOpen(false);
    }



    return (
        <div>
            <h2>Hartije od vrednosti</h2>


            {/* Filteri */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}>
                <TextField label="Berza (Exchange)" variant="outlined" value={exchangeFilter} onChange={(e) => setExchangeFilter(e.target.value)} />
                <TextField label="Ask min" variant="outlined" type="number" onChange={(e) => setAskRange({ ...askRange, min: e.target.value })} />
                <TextField label="Ask max" variant="outlined" type="number" onChange={(e) => setAskRange({ ...askRange, max: e.target.value })} />
                <TextField label="Bid min" variant="outlined" type="number" onChange={(e) => setBidRange({ ...bidRange, min: e.target.value })} />
                <TextField label="Bid max" variant="outlined" type="number" onChange={(e) => setBidRange({ ...bidRange, max: e.target.value })} />
                <TextField label="Cena min" variant="outlined" type="number" onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} />
                <TextField label="Cena max" variant="outlined" type="number" onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} />
                <TextField label="Volumen min" variant="outlined" type="number" onChange={(e) => setVolumeRange({ ...volumeRange, min: e.target.value })} />
                <TextField label="Volumen max" variant="outlined" type="number" onChange={(e) => setVolumeRange({ ...volumeRange, max: e.target.value })} />
                <TextField label="Settlement Date" type="date" InputLabelProps={{ shrink: true }} variant="outlined" onChange={(e) => setSettlementDate(e.target.value)} />
            </div>


            {/* Dugmad za filtriranje */}
            <ButtonGroup sx={{ mb: 2 }}>
                <Button
                    variant={selectedType === "stock" ? "contained" : "outlined"}
                    onClick={() => setSelectedType("stock")}
                >
                    Akcije
                </Button>
                <Button
                    variant={selectedType === "future" ? "contained" : "outlined"}
                    onClick={() => setSelectedType("future")}
                >
                    Futures
                </Button>
                {role === "actuary" && (
                    <>
                        <Button
                            variant={selectedType === "forex" ? "contained" : "outlined"}
                            onClick={() => setSelectedType("forex")}
                        >
                            Forex
                        </Button>
                        <Button
                            variant={selectedType === "option" ? "contained" : "outlined"}
                            onClick={() => setSelectedType("option")}
                        >
                            Opcije
                        </Button>
                    </>
                )}
                <Button
                    variant={selectedType === "all" ? "contained" : "outlined"}
                    onClick={() => setSelectedType("all")}
                >
                    Sve
                </Button>
            </ButtonGroup>


            {/* Pretraga i dugme za osvežavanje */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <TextField label="Pretraga po tickeru/nazivu" variant="outlined" value={search} onChange={(e) => setSearch(e.target.value)} />
                <IconButton onClick={loadSecurities}>
                    <RefreshIcon />
                </IconButton>
            </div>

            {/* DataGrid iz DataTable komponente */}
            <DataTable rows={filteredSecurities} columns={columns} checkboxSelection={false} />
            <Button onClick={() => openDetailsModal()}>Dugme</Button>

            <SecuritiesModal
                isOpen={isDetailsModalOpen}
                onClose={closeDetailsModal}
                ticker={"USD/RSD"}
                type={"forex"}
            />
        </div>
    );
};

export default SecuritiesTable;
