import React, { useEffect, useState } from 'react';
import styles from "../../styles/SecuritiesModal.module.css"
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import {createRecipientt} from "../../services/AxiosBanking";
import {
    fetchFirstStockPrice,
    fetchForex, fetchFuture,
    fetchStock, fetchStockPriceByDate,
    fetchStockPriceByMonth
} from "../../services/AxiosTrading";
function SecuritiesModal({ isOpen, onClose, ticker, type }) {

    const [security, setSecurity] = useState([]);
    const [options, setOptions] = useState([]);
    const [calls, setCalls] = useState([]);
    const [puts, setPuts] = useState([]);
    const [detailsData, setDetailsData] = useState({});
    const [stockDataMonth, setStockDataMonth] = useState([]
    );
    const [stockDataDay, setStockDataDay] = useState({});
    const [stockDataWeek, setStockDataWeek] = useState({});
    const [stockDataYear, setStockDataYear] = useState({});
    const [stockDataFiveYears, setStockDataFiveYears] = useState({});
    const [stockDataStart, setStockDataStart] = useState({});
    const [stockData, setStockData] = useState({});




    const getCurrentDate = () => {
        const date = new Date();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    };

    const getFirstDatesOfLast12Months = () => {
        const dates = [];
        const currentDate = new Date();

        for (let i = 0; i < 12; i++) {

            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);

            const formattedDate =
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            dates.push(formattedDate);
        }
        return dates;
    };

    const getFirstDatesOfLast5Years = () => {
        const dates = [];
        const currentYear = new Date().getFullYear();

        for (let i = 0; i < 5; i++) {
            const year = currentYear - i;
            const formattedDate = `${year}-01-01`;
            dates.push(formattedDate);
        }

        return dates;
    };

    const getFirstDatesFromYearToCurrent = (inputDate) => {
        const startYear = new Date(inputDate).getFullYear();
        const currentYear = new Date().getFullYear();
        const dates = [];

        for (let year = startYear; year <= currentYear; year++) {
            dates.push(`${year}-01-02`);
        }

        return dates;
    };



    const loadPrice = async (date) => {
        try {
            const price = await fetchStockPriceByDate(ticker,date);
            console.log("za datum ", date, " objekat ", price)
            return price.data;
        } catch (error) {
            console.error("Error adding recipient:", error);
        }


    }

    const fetchStockData = async (getDatesFunction, dateParam = null, setStockDataFunction) => {
        const newStockData = [];

        const datesList = dateParam ? getDatesFunction(dateParam) : getDatesFunction();

        await Promise.all(
            datesList.map(async (date) => {
                let validDataFound = false;

                // Try up to 3 consecutive days to find valid data
                for (let dayOffset = 0; dayOffset < 4; dayOffset++) {
                    const dateToCheck = new Date(date);
                    dateToCheck.setDate(dateToCheck.getDate() + dayOffset);

                    const formattedDate = `${dateToCheck.getFullYear()}-${String(dateToCheck.getMonth() + 1).padStart(2, '0')}-${String(dateToCheck.getDate()).padStart(2, '0')}`;
                    const response = await loadPrice(formattedDate);

                    if (response && response.close !== 0) {
                        newStockData.push(response);
                        validDataFound = true;
                        break;
                    }
                }

                // If no valid data is found, add a placeholder entry
                if (!validDataFound) {
                    newStockData.push({ date: date, close: 0 });
                }
            })
        );

        console.log("New stock data =", newStockData);
        newStockData.sort((a, b) => new Date(a.date) - new Date(b.date));

        setStockDataFunction(newStockData);
    };


    const fillStockData = async () => {
        const data = await fetchStockPriceByMonth(ticker)
        setStockDataMonth(data);

        console.log(data)

        const filteredData = data.filter(item => {
            const currentDate = new Date(); // Get the current date
            const targetDate = new Date(item.date); // Convert string in `date` field to Date object

            // Calculate the difference in days
            const differenceInTime = Math.abs(currentDate - targetDate);
            const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

            return differenceInDays <= 7; // Keep only if within 7 days
        });
        setStockDataWeek(filteredData);

        const firstPrice = await fetchFirstStockPrice(ticker);
        const date = new Date(firstPrice.data.date);
        const formattedFirstDate = date.toISOString().split("T")[0]; // "YYYY-MM-DD"

        console.log("formattedFirstDate price = " ,formattedFirstDate);

        console.log("current date: ", getCurrentDate())
        console.log("last 12 months: ", getFirstDatesOfLast12Months())
        console.log("last 5 years: ", getFirstDatesOfLast5Years())
        console.log("from the start: ", getFirstDatesFromYearToCurrent("03/15/2022"))


        let newStockData = [];

        fetchStockData(getFirstDatesOfLast12Months,null, setStockDataYear);
        fetchStockData(getFirstDatesOfLast5Years,null, setStockDataFiveYears);
        fetchStockData(getFirstDatesFromYearToCurrent,formattedFirstDate, setStockDataStart);




    }


    const loadDetails =async () => {
        try {

            if (type === "Stock") {
                const data = await fetchStock(ticker);
                console.log("Stock data = ",data.data);
                setDetailsData(data.data);

                setSecurity([
                    "Outstanding Shares: " + data.data.details.outstanding_shares, "Dividend Yield: " + data.data.details.dividend_yield

                ])

            } else if (type === "Forex") {
                const data = await fetchForex(ticker);
                setDetailsData(data.data);
                setSecurity([
                    "Base Currency: " + data.data.details.base_currency, "Quote Currency:  " + data.data.details.quote_currency, "Exchange Rate: " + data.data.details.exchange_rate, "Liquidity: " + data.data.details.liquidity
                ])
            }else if (type === "Future") {
                const data = await fetchFuture(ticker);
                setDetailsData(data.data);
                setSecurity([
                    "Contract Size: " + data.data.details.contract_size, "Contract Unit:  " + data.data.details.contract_unit, "Settlement Date: " + data.data.details.settlement_date
                ])
            }
        } catch (error) {
            console.error("Error loading details:", error);
        }
    }

    const loadOptions = async () => {
        try {
            // const data = await fetchOptions(ticker);
            // setOptions(data);
        } catch (error) {
            console.error("Error loading options:", error);
        }
    }

    const splitOptions =() => {
        const sortedOptions = options.sort((a, b) => a.StrikePrice - b.StrikePrice);
        const newCalls =[];
        const newPuts = [];
        sortedOptions.forEach(item => {
            if(item.OptionType === "calls"){
                newCalls.push(item);
            }else if(item.OptionType === "puts"){
                newPuts.push(item)
            }
        })
        setCalls(newCalls);
        setPuts(newPuts);
    }



    useEffect(() => {
        console.log(ticker, type)
        console.log(stockDataStart)
        if (!isOpen) {
            setSecurity([]);
            setOptions([]);
            setCalls([]);
            setPuts([]);
            setDetailsData({});
            setStockDataMonth([]);
            setStockDataDay({});
            setStockDataWeek({});
            setStockDataYear({});
            setStockDataFiveYears({});
            setStockDataStart({});
            setStockData({});
            return
        }

        loadDetails();

        if(type === "Stock"){
            fillStockData();
            // loadOptions();
            // splitOptions();
        }


    }, [isOpen,ticker]);

    if (!isOpen) return null;





    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            sx={{ "& .MuiDialog-paper": { minHeight: "700px" } }}>
            <DialogTitle>{detailsData?.listing?.name}</DialogTitle>

            <DialogContent>

                <div className="flex justify-center items-center min-h-screen bg-gray-200">
                    <div className="w-[600px] h-[450px] p-6 bg-white shadow-lg rounded-xl border border-gray-300">
                        <h2 className="text-2xl font-bold text-center mb-4">Details</h2>
                        <div style={{width: "100%", height: "300px"}}>


                            <TableContainer component={Paper}>
                                <Table className="mb-[20px]">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Ticker: {detailsData?.listing?.ticker}</TableCell>
                                            <TableCell>Name: {detailsData?.listing?.name}</TableCell>
                                            <TableCell>Type: {detailsData?.listing?.type}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Price: {detailsData?.listing?.lastPrice}</TableCell>
                                            <TableCell>Ask: {detailsData?.listing?.ask}</TableCell>
                                            <TableCell>Bid: {detailsData?.listing?.bid}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>Last refresh: {detailsData?.listing?.last_refresh}</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <h2 className="text-2xl font-bold text-center mb-4"></h2>

                            <TableContainer component={Paper}>
                                <Table className="mb-[20px]">
                                    <TableBody>

                                        <TableRow>
                                            {security.map((item, index) => (
                                                <TableCell key={index}>{item}</TableCell>
                                            ))}
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <h2 className="text-2xl font-bold text-center mb-4">Exchange information</h2>

                            <TableContainer component={Paper}>
                                <Table className="mb-[20px]">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Name: {detailsData?.listing?.exchange?.name}</TableCell>
                                            <TableCell>Acronym: {detailsData?.listing?.exchange?.acronym}</TableCell>
                                            <TableCell>Mic code: {detailsData?.listing?.exchange?.mic_code}</TableCell>
                                            <TableCell>Country: {detailsData?.listing?.exchange?.country}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Currency: {detailsData?.listing?.exchange?.currency}</TableCell>
                                            <TableCell>Timezone: {detailsData?.listing?.exchange?.timezone}</TableCell>
                                            <TableCell>Open time: {detailsData?.listing?.exchange?.open_time}</TableCell>
                                            <TableCell>Close time: {detailsData?.listing?.exchange?.close_time}</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>


                            <h2 className="text-2xl font-bold text-center mb-4">Stock Price</h2>

                            <ResponsiveContainer width="90%" height="70%">
                                <LineChart data={stockData}>
                                    <XAxis
                                        dataKey="date"

                                        tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit"
                                        })}
                                    />
                                    <YAxis
                                        dataKey={stockData[0]?.price ? "price" : (stockData[0]?.close ? "close" : "")}

                                    />
                                    <Tooltip/>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc"/>
                                    <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={3}
                                          dot={{r: 5}}/>
                                    <Line type="monotone" dataKey="close" stroke="#16a34a" strokeWidth={3}
                                          dot={{r: 5}}/>


                                </LineChart>
                            </ResponsiveContainer>



                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <Button onClick={() => setStockData(stockDataWeek)}>Week</Button>
                                <Button onClick={() => setStockData(stockDataMonth)}>Month</Button>
                                <Button onClick={() => setStockData(stockDataYear)}>Year</Button>
                                <Button onClick={() => setStockData(stockDataFiveYears)}>5 Years</Button>
                                <Button onClick={() => setStockData(stockDataStart)}>Start of Business</Button>
                            </div>

                            {type === "stock" && (

                                <div>

                            <h2 className="text-2xl font-bold text-center mb-4">Option chain</h2>


                            <table className={styles.optionChainTable}>
                                <thead>
                                <tr>
                                    <th colSpan="5">Calls</th>
                                    <th>Shared</th>
                                    <th colSpan="5">Puts</th>
                                </tr>
                                <tr>
                                    <th>Last</th>
                                    <th>Bid</th>
                                    <th>Ask</th>
                                    <th>Vol</th>
                                    <th>OI</th>
                                    <th>Strike</th>
                                    <th>Last</th>
                                    <th>Bid</th>
                                    <th>Ask</th>
                                    <th>Vol</th>
                                    <th>OI</th>
                                </tr>
                                </thead>
                                <tbody>
                                {calls.map((call, index) => {
                                    const put = puts[index] || {}; // Ensure we don’t break if puts has fewer elements
                                    return (
                                        <tr key={index}>
                                            <td>{call.Listing.LastPrice || ""}</td>
                                            <td>{call.Listing.Bid || ""}</td>
                                            <td>{call.Listing.Ask || ""}</td>
                                            <td>{call.ImpliedVol || ""}</td>
                                            <td>{call.OpenInterest || ""}</td>
                                            <td className={styles.strike}>{call.StrikePrice || put.StrikePrice || ""}</td>
                                            <td>{put.Listing.LastPrice || ""}</td>
                                            <td>{put.Listing.Bid || ""}</td>
                                            <td>{put.Listing.Ask || ""}</td>
                                            <td>{put.ImpliedVol || ""}</td>
                                            <td>{put.OpenInterest || ""}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>

                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </DialogContent>

        </Dialog>
    );
}

export default SecuritiesModal;