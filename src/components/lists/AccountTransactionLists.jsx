import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Chip } from "@mui/material";
import { fetchAccountsTransactions } from "../../services/AxiosBanking";

const AccountTransactionsList = ({ accountId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Columns for DataGrid
  const columns = [
    {
      field: "direction",
      headerName: "Type",
      width: 120,
      renderCell: (params) => {
        const isIncoming = params.value === "incoming";
        return (
          <Chip
            label={isIncoming ? "Incoming" : "Outgoing"}
            size="small"
            sx={{
              backgroundColor: isIncoming ? "#2e7d32" : "#c62828",
              color: "white",
              fontWeight: "bold",
            }}
          />
        );
      },
    },
    { field: "id", headerName: "ID", width: 90 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "amount", headerName: "Amount", width: 130 },
    { field: "description", headerName: "Description", width: 250 },
    { field: "finalAmount", headerName: "Final Amount", width: 150 },
    { field: "fee", headerName: "Fee", width: 100 },
  ];

  const formatLogDate = (log) => {
    if (typeof log !== "string" && typeof log !== "number") return String(log);
    const strLog = String(log);
    if (strLog.length === 8) {
      const year = strLog.slice(0, 4);
      const month = strLog.slice(4, 6);
      const day = strLog.slice(6, 8);
      return `${year}-${month}-${day}`;
    }
    return strLog;
  };

  useEffect(() => {
    const loadTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchAccountsTransactions(accountId);
        const data = response.data.transactions;
        console.log("Tranzakcije = ", data)

        const formattedTransactions = data.map((transaction) => {
          const isIncoming = transaction.transfer.toAccountId.id === accountId;

          return {
            id: transaction.id,
            date: new Date(transaction.transfer.createdAt).toLocaleDateString(),
            // date: formatLogDate(transaction.date), // Optional
            amount: transaction.amount.toFixed(2) + " " + transaction.transfer.fromCurrency.code,
            description: transaction.description,
            finalAmount: transaction.finalAmount.toFixed(2) + " " + transaction.transfer.toCurrency.code,
            fee: transaction.fee.toFixed(2) + " " + transaction.transfer.toCurrency.code,
            direction: isIncoming ? "incoming" : "outgoing",
          };
        });

        setTransactions(formattedTransactions);
      } catch (err) {
        console.error(err);
        setError("This account has no transactions available.");
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      loadTransactions();
    }
  }, [accountId]);

  if (loading) return <p>Loading transactions...</p>;
  else if (error) return <p>{error}</p>;

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={transactions}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        getRowId={(row) => row.id}
      />
    </Paper>
  );
};

export default AccountTransactionsList;
