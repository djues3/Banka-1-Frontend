import React, {useEffect, useMemo, useState} from "react";
import {
    Button,
    TextField,
    ButtonGroup,
    IconButton, Box,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import {fetchAvailableSecurities, fetchSecurities, updateSecurity} from "../../services/AxiosTrading";
import DataTable from "../tables/DataTable";
import BuyModal from "../createOrderComponents/BuyModal";
import SecuritiesModal from "../common/SecuritiesModal";

//TODO: zakomentarisana je metoda loadSecurities koja zove available securities,
// izmeniti kada poziv securities/available daje neku datu
//TODO: proveriti kad se urade options, i previousClose za change!!!

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
    const [selectedSecurity, setSelectedSecurity] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            // Fetchujemo sve hartije (securities)
            const { data: allSecurities } = await fetchSecurities();

            // Računamo `change` i `initialMarginCost` za svaku hartiju
            const mergedSecurities = allSecurities.map((sec, index) => {
                console.log(`Processing security: ${sec.ticker}`);

                // Računanje `change`
                const change = sec.previousClose
                    ? (((sec.lastPrice - sec.previousClose) / sec.previousClose) * 100).toFixed(2) + "%"
                    : "N/A";

                // Računanje `maintenanceMargin` zavisno od tipa hartije
                let maintenanceMargin = 0;
                if (sec.type === "Stock") {
                    maintenanceMargin = sec.lastPrice * 0.5;
                } else if (sec.type === "Forex") {
                    maintenanceMargin = sec.contractSize * sec.lastPrice * 0.1;
                } else if (sec.type === "Future") {
                    maintenanceMargin = sec.contractSize * sec.lastPrice * 0.1;
                } else if (sec.type === "Option") {
                    maintenanceMargin = 100 * sec.lastPrice * 0.5;
                }

                // Računanje `initialMarginCost`
                const initialMarginCost = (maintenanceMargin * 1.1).toFixed(2);

                return {
                    id: sec.ticker || index,
                    ...sec,
                    // Zadržavamo availableQuantity iz originalnog objekta ili postavljamo na 0 ako ne postoji
                    availableQuantity: sec.availableQuantity || 0,
                    change,
                    initialMarginCost,
                };
            });

            console.log("Merged Securities:", mergedSecurities);
            setSecurities(mergedSecurities);
        } catch (error) {
            console.error("Neuspešno učitavanje podataka o hartijama", error);
        }
    };


    /*
        const loadSecurities = async () => {
            try {
                const {data:allSecurities} = await fetchSecurities();
               // const availableSecurities = await fetchAvailableSecurities();
                const { data: availableSecurities } = await fetchAvailableSecurities();
                console.log("Available Securities:", availableSecurities);

                // Mapa dostupnih hartija za kupovinu
                const availableMap = new Map(availableSecurities.map(sec => [sec.ticker, sec.availableQuantity]));

                // Računamo `change` i `initialMarginCost`
                const mergedSecurities = allSecurities.map(sec => {

                    console.log(`Available Quantity for ${sec.ticker}:`, sec.availableQuantity);
                    // Računanje `change`
                    const change = sec.previousClose
                        ? (((sec.lastPrice - sec.previousClose) / sec.previousClose) * 100).toFixed(2) + "%"
                        : "N/A";

                    // Računanje `maintenanceMargin` zavisno od tipa
                    let maintenanceMargin = 0;
                    if (sec.type === "Stock") {
                        maintenanceMargin = sec.lastPrice * 0.5;
                    } else if (sec.type === "Forex") {
                        maintenanceMargin = 1000 * sec.lastPrice * 0.1;
                    } else if (sec.type === "Future") {
                        maintenanceMargin = sec.contractSize * sec.lastPrice * 0.1;
                    } else if (sec.type === "Option") {
                        maintenanceMargin = 100 * sec.lastPrice * 0.5;
                    }

                    // Računanje `initialMarginCost`
                    const initialMarginCost = (maintenanceMargin * 1.1).toFixed(2);
                    const index = 1;

                    return {
                        id: sec.ticker || index,
                        ...sec,
                        availableQuantity: sec.availableQuantity || 0,
                        change,
                        initialMarginCost
                    };
                });

                console.log("Merged Securities:", mergedSecurities);

                setSecurities(mergedSecurities);
            } catch (error) {
                console.error("Neuspešno učitavanje podataka o hartijama", error);
            }
        };

     */

    const handleBuyClick = (security) => {
        setSelectedSecurity(security);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Zatvori modal
    };


    const handleUpdate = async (ticker) => {
        try {
            await updateSecurity(ticker, { lastPrice: Math.random() * 100 });
            loadSecurities(); // Osveži listu
        } catch (error) {
            console.error("Greška pri osvežavanju hartije");
        }
    };

    const filteredSecurities = useMemo(() => {
        return securities.filter(sec => {
            const matchesRole = role === "client"
                ? ["stock", "future"].includes(sec.type.toLowerCase())
                : sec.type.toLowerCase() !== "bond";

            const matchesType = selectedType === "all" || sec.type.toLowerCase() === selectedType.toLowerCase();
            // const matchesSearch = sec.ticker.toLowerCase().includes(search.toLowerCase()) || sec.name.toLowerCase().includes(search.toLowerCase());
            const matchesExchange = exchangeFilter ? sec.exchange.toLowerCase().startsWith(exchangeFilter.toLowerCase()) : true;
            const matchesPrice = priceRange.min === "" || priceRange.max === "" || (sec.lastPrice >= parseFloat(priceRange.min) && sec.lastPrice <= parseFloat(priceRange.max));

            const matchesSearch =
                (sec.ticker && sec.ticker.toLowerCase().includes(search.toLowerCase())) ||
                (sec.name && sec.name.toLowerCase().includes(search.toLowerCase()));


            const matchesAsk = (sec.ask !== undefined) && (askRange.min === "" || askRange.max === "" || (sec.ask >= parseFloat(askRange.min) && sec.ask <= parseFloat(askRange.max)));
            const matchesBid = (sec.bid !== undefined) && (bidRange.min === "" || bidRange.max === "" || (sec.bid >= parseFloat(bidRange.min) && sec.bid <= parseFloat(bidRange.max)));
            const matchesVolume = (sec.availableQuantity !== undefined) && (volumeRange.min === "" || volumeRange.max === "" || (sec.availableQuantity >= parseFloat(volumeRange.min) && sec.availableQuantity <= parseFloat(volumeRange.max)));

            const matchesSettlement =
                settlementDate === "" ||
                (sec.settlementDate && sec.settlementDate === settlementDate);

            return matchesRole && matchesType && matchesSearch && matchesExchange && matchesAsk && matchesBid && matchesPrice && matchesVolume &&  matchesSettlement;
        });
    }, [securities, selectedType, search, exchangeFilter, askRange, bidRange, priceRange, volumeRange, role, settlementDate]);


    const resetFilter = (filterName) => {
        if (filterName === "askRange") setAskRange({ min: "", max: "" });
        if (filterName === "bidRange") setBidRange({ min: "", max: "" });
        if (filterName === "priceRange") setPriceRange({ min: "", max: "" });
        if (filterName === "volumeRange") setVolumeRange({ min: "", max: "" });
        if (filterName === "settlementDate") setSettlementDate("");
        if (filterName === "exchangeFilter") setExchangeFilter("");
    };

    const handleChange = (e, filterName) => {
        if (e.target.value === "") {
            resetFilter(filterName);
        } else {
            switch (filterName) {
                case "askRange":
                    setAskRange({ ...askRange, [e.target.name]: e.target.value });
                    break;
                case "bidRange":
                    setBidRange({ ...bidRange, [e.target.name]: e.target.value });
                    break;
                case "priceRange":
                    setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
                    break;
                case "volumeRange":
                    setVolumeRange({ ...volumeRange, [e.target.name]: e.target.value });
                    break;
                case "settlementDate":
                    setSettlementDate(e.target.value);
                    break;
                case "exchangeFilter":
                    setExchangeFilter(e.target.value);
                    break;
                default:
                    break;
            }
        }
    };

    console.log("Filtered Securities:", filteredSecurities);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [detailsType, setDetailsType] = useState("");
    const [detailsTicker, setDetailsTicker] = useState("");
    const openDetailsModal = (security) => {
        console.log(security)
        setDetailsType(security.type)
        setDetailsTicker(security.ticker)
        setIsDetailsModalOpen(true);
    }
    const closeDetailsModal =() => {
        setDetailsType("")
        setDetailsTicker("")
        setIsDetailsModalOpen(false);
    }


    const columns = [
        { field: "ticker", headerName: "Ticker", width: 180 },
        { field: "lastPrice", headerName: "Price", width: 180, type: "number" },
        { field: "change", headerName: "Promena", width: 180, type: "number" },
        { field: "availableQuantity", headerName: "Volume", width: 160, type: "number" },
        {
            field: "initialMarginCost",
            headerName: "Initial Margin Cost",
            width: 200,
            type: "number",
            // valueGetter: (params) => (params.row.maintenanceMargin ? (params.row.maintenanceMargin * 1.1).toFixed(2) : "N/A")
        },
        { field: "actions", headerName: "Action", width: 100, renderCell: (params) => (
                <>
                    {params.row.availableQuantity > 0 && ( /*Treba da se zove dunjin BuyModal */
                        <Button variant="outlined" onClick={() => handleBuyClick(params.row)}>Buy</Button>
                    )}
                </>
            )}
        ,{
            field: "Details",
            headerName: "",
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    onClick={() => openDetailsModal(params.row)}
                >
                    Details
                </Button>
            ),
        }
    ];





    return (
        <div>
            <h2>Securities</h2>

            {/* FILTERS */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>

                {/* Row 1: Search, Exchange, Settlement Date */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                        label="Search ticker/name"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <TextField
                        label="Exchange"
                        variant="outlined"
                        value={exchangeFilter}
                        onChange={(e) => handleChange(e, "exchangeFilter")}
                    />
                    {(selectedType === "future" || selectedType === "option" || selectedType === "all") && (
                        <TextField
                            label="Settlement Date"
                            type="date"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={settlementDate}
                            onChange={(e) => handleChange(e, "settlementDate")}
                        />
                    )}
                    <IconButton onClick={loadSecurities}>
                        <RefreshIcon />
                    </IconButton>
                </Box>

                {/* Row 2: Ask & Bid */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField label="Ask Min" type="number" name="min" value={askRange.min} onChange={(e) => handleChange(e, "askRange")} />
                    <TextField label="Ask Max" type="number" name="max" value={askRange.max} onChange={(e) => handleChange(e, "askRange")} />
                    <TextField label="Bid Min" type="number" name="min" value={bidRange.min} onChange={(e) => handleChange(e, "bidRange")} />
                    <TextField label="Bid Max" type="number" name="max" value={bidRange.max} onChange={(e) => handleChange(e, "bidRange")} />
                </Box>

                {/* Row 3: Price & Volume */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField label="Price Min" type="number" name="min" value={priceRange.min} onChange={(e) => handleChange(e, "priceRange")} />
                    <TextField label="Price Max" type="number" name="max" value={priceRange.max} onChange={(e) => handleChange(e, "priceRange")} />
                    <TextField label="Volume Min" type="number" name="min" value={volumeRange.min} onChange={(e) => handleChange(e, "volumeRange")} />
                    <TextField label="Volume Max" type="number" name="max" value={volumeRange.max} onChange={(e) => handleChange(e, "volumeRange")} />
                </Box>
            </Box>

            {/* TYPE FILTER BUTTONS */}
            <ButtonGroup sx={{ mb: 2 }}>
                <Button variant={selectedType === "stock" ? "contained" : "outlined"} onClick={() => setSelectedType("stock")}>Stocks</Button>
                <Button variant={selectedType === "future" ? "contained" : "outlined"} onClick={() => setSelectedType("future")}>Futures</Button>
                {role === "actuary" && (
                    <>
                        <Button variant={selectedType === "forex" ? "contained" : "outlined"} onClick={() => setSelectedType("forex")}>Forex</Button>
                    </>
                )}
                <Button variant={selectedType === "all" ? "contained" : "outlined"} onClick={() => setSelectedType("all")}>All</Button>
            </ButtonGroup>

            {/* TABLE */}
            <DataTable rows={filteredSecurities} columns={columns} checkboxSelection={false} />

            {/* MODALS */}
            {isModalOpen && (
                <BuyModal
                    security={selectedSecurity}
                    open={true}
                    onClose={handleCloseModal}
                />
            )}
            <SecuritiesModal
                isOpen={isDetailsModalOpen}
                onClose={closeDetailsModal}
                type={detailsType}
                ticker={detailsTicker}
            />
        </div>
    );
};

export default SecuritiesTable;