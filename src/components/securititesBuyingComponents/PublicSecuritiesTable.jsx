import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchPublicSecurities } from "../../services/AxiosTrading";
import DataTable from "../tables/DataTable";
import SecuritiesModal from "../common/SecuritiesModal";
import MakeOfferModal from "../common/MakeOfferModal";
import { toast, ToastContainer } from "react-toastify";

const PublicSecuritiesTable = () => {
    const [securities, setSecurities] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [askRange, setAskRange] = useState({ min: "", max: "" });
    const [bidRange, setBidRange] = useState({ min: "", max: "" });
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [volumeRange, setVolumeRange] = useState({ min: "", max: "" });
    const [settlementDate, setSettlementDate] = useState("");

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [detailsType, setDetailsType] = useState("");
    const [detailsTicker, setDetailsTicker] = useState("");

    const [selectedSecurity, setSelectedSecurity] = useState(null);
    const [isMakeOfferModalOpen, setIsMakeOfferModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchPublicSecurities();
                console.log(res.data);
                const data = res?.data || [];
                const mapped = data.map((item, i) => {
                    const sec = item.security || {};
                    return {
                        id: i,
                        ...sec,
                        ticker: sec.ticker || item.ticker,
                        name: sec.name || item.name,
                        type: sec.type || item.type,
                        lastPrice: sec.lastPrice || item.price || 0,
                        ask: sec.ask,
                        bid: sec.bid,
                        public: item.quantity || 0,
                        portfolioId: item.portfolioId || null,
                        ownerId: item.ownerId,
                        quantity: item.quantity
                    };
                });
                setSecurities(mapped);
            } catch (error) {
                console.error("Greška pri učitavanju OTC hartija:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

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
                default:
                    break;
            }
        }
    };

    const resetFilter = (filterName) => {
        switch (filterName) {
            case "askRange":
                setAskRange({ min: "", max: "" });
                break;
            case "bidRange":
                setBidRange({ min: "", max: "" });
                break;
            case "priceRange":
                setPriceRange({ min: "", max: "" });
                break;
            case "volumeRange":
                setVolumeRange({ min: "", max: "" });
                break;
            case "settlementDate":
                setSettlementDate("");
                break;
            default:
                break;
        }
    };

    const openDetailsModal = (security) => {
        setDetailsType(security.type);
        setDetailsTicker(security.ticker);
        setIsDetailsModalOpen(true);
    };

    const openMakeOfferModal = (security) => {
        const { ownerId, quantity, portfolioId, ticker } = security;
        setSelectedSecurity({ ownerId, quantity, portfolioId, ticker });
        setIsMakeOfferModalOpen(true);
    };

    const closeDetailsModal = () => setIsDetailsModalOpen(false);
    const closeMakeOfferModal = () => setIsMakeOfferModalOpen(false);

    const filteredSecurities = useMemo(() => {
        return securities.filter((sec) => {
            const matchesType = selectedType === "all" || sec.type.toLowerCase() === selectedType.toLowerCase();
            const matchesSearch =
                (sec.ticker && sec.ticker.toLowerCase().includes(search.toLowerCase())) ||
                (sec.name && sec.name.toLowerCase().includes(search.toLowerCase()));
            const matchesAsk = sec.ask !== undefined &&
                (askRange.min === "" || sec.ask >= parseFloat(askRange.min)) &&
                (askRange.max === "" || sec.ask <= parseFloat(askRange.max));
            const matchesBid = sec.bid !== undefined &&
                (bidRange.min === "" || sec.bid >= parseFloat(bidRange.min)) &&
                (bidRange.max === "" || sec.bid <= parseFloat(bidRange.max));
            const matchesPrice =
                (priceRange.min === "" || sec.lastPrice >= parseFloat(priceRange.min)) &&
                (priceRange.max === "" || sec.lastPrice <= parseFloat(priceRange.max));
            const matchesVolume =
                (volumeRange.min === "" || sec.public >= parseFloat(volumeRange.min)) &&
                (volumeRange.max === "" || sec.public <= parseFloat(volumeRange.max));
            const matchesSettlement =
                settlementDate === "" || sec.settlementDate === settlementDate;

            return matchesType && matchesSearch && matchesAsk && matchesBid && matchesPrice && matchesVolume && matchesSettlement;
        });
    }, [securities, selectedType, search, askRange, bidRange, priceRange, volumeRange, settlementDate]);

    const columns = [
        { field: "ticker", headerName: "Ticker", width: 100 },
        { field: "lastPrice", headerName: "Price", width: 200 },
        { field: "ask", headerName: "Ask", width: 200 },
        { field: "bid", headerName: "Bid", width: 200 },
        { field: "public", headerName: "Volume", width: 100 },
        {
            field: "actions",
            headerName: "Actions",
            width: 300,
            renderCell: (params) => (
                <>
                    <Button variant="outlined" onClick={() => openMakeOfferModal(params.row)}>Make Offer</Button>
                    <Button variant="outlined" onClick={() => openDetailsModal(params.row)} sx={{ ml: 1 }}>
                        Details
                    </Button>
                </>
            )
        }
    ];

    return (
        <Box sx={{ padding: "30px" }}>
            <Typography variant="h4" gutterBottom>
                Public OTC Securities
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
                {/* Row 1: Search, Settlement Date, Refresh */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                    <TextField
                        label="Search ticker/name"
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <TextField
                        label="Settlement Date"
                        type="date"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={settlementDate}
                        onChange={(e) => handleChange(e, "settlementDate")}
                    />
                    <IconButton onClick={() => window.location.reload()}>
                        <RefreshIcon />
                    </IconButton>
                </Box>

                {/* Row 2: Ask & Bid */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                        label="Ask min"
                        type="number"
                        name="min"
                        value={askRange.min}
                        onChange={(e) => handleChange(e, "askRange")}
                    />
                    <TextField
                        label="Ask max"
                        type="number"
                        name="max"
                        value={askRange.max}
                        onChange={(e) => handleChange(e, "askRange")}
                    />
                    <TextField
                        label="Bid min"
                        type="number"
                        name="min"
                        value={bidRange.min}
                        onChange={(e) => handleChange(e, "bidRange")}
                    />
                    <TextField
                        label="Bid max"
                        type="number"
                        name="max"
                        value={bidRange.max}
                        onChange={(e) => handleChange(e, "bidRange")}
                    />
                </Box>

                {/* Row 3: Price & Volume */}
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <TextField
                        label="Price min"
                        type="number"
                        name="min"
                        value={priceRange.min}
                        onChange={(e) => handleChange(e, "priceRange")}
                    />
                    <TextField
                        label="Price max"
                        type="number"
                        name="max"
                        value={priceRange.max}
                        onChange={(e) => handleChange(e, "priceRange")}
                    />
                    <TextField
                        label="Volume min"
                        type="number"
                        name="min"
                        value={volumeRange.min}
                        onChange={(e) => handleChange(e, "volumeRange")}
                    />
                    <TextField
                        label="Volume max"
                        type="number"
                        name="max"
                        value={volumeRange.max}
                        onChange={(e) => handleChange(e, "volumeRange")}
                    />
                </Box>
            </Box>

            {/*</ButtonGroup>*/}

            <DataTable rows={filteredSecurities} columns={columns} checkboxSelection={false} />
            <ToastContainer position="bottom-right" />

            <SecuritiesModal
                isOpen={isDetailsModalOpen}
                onClose={closeDetailsModal}
                type={detailsType}
                ticker={detailsTicker}
            />
            <MakeOfferModal
                open={isMakeOfferModalOpen}
                onClose={closeMakeOfferModal}
                security={selectedSecurity}
            />
        </Box>
    );
};

export default PublicSecuritiesTable;