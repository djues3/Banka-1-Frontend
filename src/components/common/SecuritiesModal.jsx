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
    fetchForex, fetchForexHistory, fetchFuture, fetchFutureHistory, fetchOptions,
    fetchStock, fetchStockPriceByDate,
    fetchStockPriceByMonth
} from "../../services/AxiosTrading";
function SecuritiesModal({ isOpen, onClose, ticker, type }) {

    //Details
    const [security, setSecurity] = useState([]);
    const [detailsData, setDetailsData] = useState({});


    //option chain
    const [options, setOptions] = useState({});
    const [settlementDates, setSettlementDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [calls, setCalls] = useState([]);
    const [puts, setPuts] = useState([]);
    const [maxOptionCount, setMaxOptionCount] = useState(0);
    const [selectedOptionCount, setSelectedOptionCount] = useState(0);

    //history
    const [stockDataWeek, setStockDataWeek] = useState({});
    const [stockDataMonth, setStockDataMonth] = useState([]);
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
            // console.log("za datum ", date, " objekat ", price)
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

        // console.log("New stock data =", newStockData);
        newStockData.sort((a, b) => new Date(a.date) - new Date(b.date));

        setStockDataFunction(newStockData);
    };


    const fillStockData = async () => {

        if(type === "Stock") {

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

            console.log("formattedFirstDate price = ", formattedFirstDate);

            console.log("current date: ", getCurrentDate())
            console.log("last 12 months: ", getFirstDatesOfLast12Months())
            console.log("last 5 years: ", getFirstDatesOfLast5Years())
            console.log("from the start: ", getFirstDatesFromYearToCurrent("03/15/2022"))


            let newStockData = [];

            fetchStockData(getFirstDatesOfLast12Months, null, setStockDataYear);
            fetchStockData(getFirstDatesOfLast5Years, null, setStockDataFiveYears);
            fetchStockData(getFirstDatesFromYearToCurrent, formattedFirstDate, setStockDataStart);

        }else if (type === "Future"){
            const respone = await fetchFutureHistory(ticker);
            const newStockData =[{
                price: respone.data[0].Price,
                date: respone.data[0].SnapshotDate
            }]
            setStockData(newStockData)
            console.log(respone)
        }else if (type === "Forex"){

            const respone = await fetchForexHistory(ticker);
            const newStockData =[{
                price: respone.data[0].Price,
                date: respone.data[0].SnapshotDate
            }]
            setStockData(newStockData)
            console.log(respone)
        }




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
            const data = await fetchOptions(ticker);
            console.log(data.data)


            const { details, listing } = data.data;

            const groupedBySettlementAndType = {};

            details.forEach((detail, index) => {
                const settlementDate = detail.SettlementDate;
                const optionType = detail.OptionType.toLowerCase();
                const combined = {
                    ...detail,
                    ...listing[index],
                };

                if (!groupedBySettlementAndType[settlementDate]) {
                    groupedBySettlementAndType[settlementDate] = {
                        call: [],
                        put: [],
                    };
                }

                groupedBySettlementAndType[settlementDate][optionType].push(combined);
            });

            const dates = Object.keys(groupedBySettlementAndType).sort()




            setOptions(groupedBySettlementAndType);
            setSettlementDates(dates);
            setSelectedDate(dates[0] ?? null);

        } catch (error) {
            console.error("Error loading options:", error);
        }
    }

    useEffect(() => {
        if (selectedDate && options[selectedDate]) {
            console.log("Duzina Calls / Duzina puts ",options[selectedDate].call.length , "/", options[selectedDate].put.length)

            if(options[selectedDate].call.length > options[selectedDate].put.length){
                setMaxOptionCount(Math.ceil(options[selectedDate].call.length / 2))
                setSelectedOptionCount(Math.ceil(options[selectedDate].call.length / 2) )
            }else {
                setMaxOptionCount(Math.ceil(options[selectedDate].put.length / 2))
                setSelectedOptionCount(Math.ceil(options[selectedDate].put.length / 2))
            }



        }
    }, [selectedDate, options]);


    useEffect(() => {
        if(selectedDate && options[selectedDate]){
            const allCalls = options[selectedDate].call || [];
            const allPuts = options[selectedDate].put || [];
            const sharedPrice = detailsData?.listing?.lastPrice


            const sortedCalls = allCalls
                .slice()
                .sort((a, b) => Math.abs(a.StrikePrice - sharedPrice) - Math.abs(b.StrikePrice - sharedPrice))
                .slice(0, selectedOptionCount * 2)
                .sort((a, b) => a.StrikePrice - b.StrikePrice);

            const sortedPuts = allPuts
                .slice()
                .sort((a, b) => Math.abs(a.StrikePrice - sharedPrice) - Math.abs(b.StrikePrice - sharedPrice))
                .slice(0, selectedOptionCount * 2)
                .sort((a, b) => a.StrikePrice - b.StrikePrice);

            setCalls(sortedCalls);
            setPuts(sortedPuts);
        }else{
            setCalls([]);
            setPuts([]);
        }
    }, [selectedOptionCount]);



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
            setStockDataWeek({});
            setStockDataYear({});
            setStockDataFiveYears({});
            setStockDataStart({});
            setStockData({});
            return
        }

        loadDetails();
        fillStockData();

        if(type === "Stock"){

            loadOptions();
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
            <DialogTitle>{detailsData?.listing?.ticker}</DialogTitle>

            <DialogContent>

                <div className="flex justify-center items-center min-h-screen bg-gray-200">
                    <div className="w-[600px] h-[450px] p-6 bg-white shadow-lg rounded-xl border border-gray-300">
                        <br/>
                        <h2 className="text-2xl font-bold text-center mb-4">Details</h2>
                        <br/>
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

                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TableContainer component={Paper}>
                                <Table className="mb-[20px]">
                                    <TableBody>

                                        <TableRow>
                                            <TableCell>
                                                Last
                                                refresh: {new Date(detailsData?.listing?.last_refresh).toLocaleString()}
                                            </TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <br/>

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
                            <br/>

                            <h2 className="text-2xl font-bold text-center mb-4">Exchange information</h2>
                            <br/>

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
                                            <TableCell>Open
                                                time: {detailsData?.listing?.exchange?.open_time}</TableCell>
                                            <TableCell>Close
                                                time: {detailsData?.listing?.exchange?.close_time}</TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <br/>

                            <h2 className="text-2xl font-bold text-center mb-4">Stock Price</h2>
                            <br/>

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

                            {type === "Stock" && (

                                <div style={{height: "400px", width: "100%"}}>


                                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                        <Button onClick={() => setStockData(stockDataWeek)}>Week</Button>
                                        <Button onClick={() => setStockData(stockDataMonth)}>Month</Button>
                                        <Button onClick={() => setStockData(stockDataYear)}>Year</Button>
                                        <Button onClick={() => setStockData(stockDataFiveYears)}>5 Years</Button>
                                        <Button onClick={() => setStockData(stockDataStart)}>Start of Business</Button>
                                    </div>
                                    <br/>


                                    <h2 className="text-2xl font-bold text-center mb-4">Option chain</h2>
                                    <br/>


                                    <label htmlFor="settlementDate">Settlement Date: </label>
                                    <select
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    >
                                        {settlementDates.map((date) => (
                                            <option key={date} value={date}>
                                                {date}
                                            </option>
                                        ))}
                                    </select>
                                    <br/>

                                    <label htmlFor="optionCount">Number of options: </label>
                                    <select
                                        id="optionCount"
                                        value={selectedOptionCount}
                                        onChange={(e) => setSelectedOptionCount(Number(e.target.value))}
                                        className="mb-4 p-2 border rounded"
                                    >

                                        {Array.from({length: maxOptionCount}, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>


                                    <table className={styles.optionChainTable}>
                                        <thead>
                                        <tr>
                                            <th colSpan="5">Calls</th>
                                            <th style={{backgroundColor: '#3d3d3d', color: 'white'}}></th>

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
                                        {(() => {
                                            const callMap = {};
                                            const putMap = {};

                                            calls.forEach(call => {
                                                callMap[call.StrikePrice] = call;
                                            });

                                            puts.forEach(put => {
                                                putMap[put.StrikePrice] = put;
                                            });


                                            const allStrikes = Array.from(new Set([
                                                ...calls.map(c => c.StrikePrice),
                                                ...puts.map(p => p.StrikePrice)
                                            ])).sort((a, b) => a - b);


                                            let sharedRowInserted = false;

                                            return allStrikes.map((strike, index) => {
                                                const call = callMap[strike] || {};
                                                const put = putMap[strike] || {};

                                                const rows = [];

                                                if (!sharedRowInserted && strike > detailsData?.listing?.lastPrice) {
                                                    sharedRowInserted = true;


                                                    rows.push(
                                                        <tr key={`shared-${index}`} style={{fontWeight: 'bold'}}>
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                            <td style={{backgroundColor: 'gray'}}>{detailsData?.listing?.lastPrice}</td>
                                                            {/* Shared price */}
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                            <td style={{backgroundColor: 'gray'}}>-</td>
                                                        </tr>
                                                    );
                                                }


                                                if (!sharedRowInserted) {
                                                    rows.push(
                                                        <tr key={index}>

                                                            <td style={{backgroundColor: 'green'}}>{call.lastPrice ?? '-'}</td>
                                                            <td style={{backgroundColor: 'green'}}>{call.bid ?? '-'}</td>
                                                            <td style={{backgroundColor: 'green'}}>{call.ask ?? '-'}</td>
                                                            <td style={{backgroundColor: 'green'}}>{call.ImpliedVol ? call.ImpliedVol.toFixed(5) : '-'}</td>
                                                            <td style={{backgroundColor: 'green'}}>{call.OpenInterest ?? '-'}</td>


                                                            <td style={{backgroundColor: 'gray'}}>{strike}</td>

                                                            <td style={{backgroundColor: 'red'}}>{put.lastPrice ?? '-'}</td>
                                                            <td style={{backgroundColor: 'red'}}>{put.bid ?? '-'}</td>
                                                            <td style={{backgroundColor: 'red'}}>{put.ask ?? '-'}</td>
                                                            <td style={{backgroundColor: 'red'}}>{put.ImpliedVol ? put.ImpliedVol.toFixed(5) : '-'}</td>
                                                            <td style={{backgroundColor: 'red'}}>{put.OpenInterest ?? '-'}</td>
                                                        </tr>
                                                    );
                                                }


                                                if (sharedRowInserted) {
                                                    rows.push(
                                                        <tr key={`after-shared-${index}`}>

                                                            <td style={{backgroundColor: 'red'}}>{call.lastPrice ?? '-'}</td>
                                                            <td style={{backgroundColor: 'red'}}>{call.bid ?? '-'}</td>
                                                            <td style={{backgroundColor: 'red'}}>{call.ask ?? '-'}</td>
                                                            <td style={{backgroundColor: 'red'}}>{call.ImpliedVol ? call.ImpliedVol.toFixed(5) : '-'}</td>
                                                            <td style={{backgroundColor: 'red'}}>{call.OpenInterest ?? '-'}</td>


                                                            <td style={{backgroundColor: 'gray'}}>{strike}</td>


                                                            <td style={{backgroundColor: 'green'}}>{put.lastPrice ?? '-'}</td>
                                                            <td style={{backgroundColor: 'green'}}>{put.bid ?? '-'}</td>
                                                            <td style={{backgroundColor: 'green'}}>{put.ask ?? '-'}</td>
                                                            <td style={{backgroundColor: 'green'}}>{put.ImpliedVol ? put.ImpliedVol.toFixed(5) : '-'}</td>
                                                            <td style={{backgroundColor: 'green'}}>{put.OpenInterest ?? '-'}</td>
                                                        </tr>
                                                    );
                                                }

                                                return rows;
                                            });
                                        })()}
                                        </tbody>
                                    </table>

                                    <br/>
                                    <br/>

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