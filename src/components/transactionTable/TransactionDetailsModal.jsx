import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Typography,
    Button,
    Box
} from "@mui/material";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const TransactionDetailsModal = ({ open, onClose, transaction }) => {
    if (!transaction) return null;

    const formatValue = (value) => (value ? value : "N/A");

    let formattedDate = "N/A";
    let formattedTime = "N/A";

    let timestamp = transaction.timestamp;

    if (!timestamp || isNaN(timestamp)) {
        if (transaction.completedAt) {
            if (!isNaN(transaction.completedAt)) {
                timestamp = Number(transaction.completedAt);
            } else {
                const dateParts = transaction.completedAt.split(",")[0].split("/");
                const timePart = transaction.completedAt.split(",")[1]?.trim() || "00:00:00";

                if (dateParts.length === 3) {
                    const [day, month, year] = dateParts;
                    timestamp = new Date(`${year}-${month}-${day}T${timePart}`).getTime();
                }
            }
        }
    }

    if (timestamp && !isNaN(timestamp)) {
        if (timestamp > 9999999999999) {
            timestamp = Math.floor(timestamp / 1000);
        }

        const dateObj = new Date(timestamp);
        if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toISOString().split("T")[0];
            formattedTime = dateObj.toLocaleTimeString();
        }
    }

    const handleDownloadPDF = () => {
        const fileName = `Transaction report.pdf`;

        const docDefinition = {
            content: [
                { text: "Transaction Report", style: "header" },
                { text: "\n" },
                {
                    table: {
                        widths: ["40%", "60%"],
                        body: [
                            ["Transaction ID", formatValue(transaction.id)],
                            ["Sender Name", formatValue(transaction.sender)],
                            ["Sender Account", formatValue(transaction.senderAccount)],
                            ["Recipient Name", formatValue(transaction.receiver)],
                            ["Recipient Account", formatValue(transaction.receiverAccount)],
                            ["Payment Purpose", formatValue(transaction.paymentPurpose)],
                            ["Amount", `${formatValue(transaction.amount)} RSD`],
                            ["Payment Code", formatValue(transaction.paymentCode)],
                            ["Reference Number", formatValue(transaction.referenceNumber)],
                            ["Date & Time", `${formattedDate} at ${formattedTime}`]
                        ]
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: "center",
                    marginBottom: 10
                }
            }
        };

        pdfMake.createPdf(docDefinition).download(fileName);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", backgroundColor: "#1e1e2e", color: "#fff" }}>
                Transaction Details
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: "#1e1e2e" }}>
                <Box sx={{
                    width: "100%",
                    padding: 3,
                    backgroundColor: "#1e1e2e",
                    borderRadius: 2,
                    border: "2px solid #2c2f3f"
                }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Transaction ID:</b> {formatValue(transaction.id)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Sender Name:</b> {formatValue(transaction.sender)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Sender Account:</b> {formatValue(transaction.senderAccount)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Recipient Name:</b> {formatValue(transaction.receiver)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Recipient Account:</b> {formatValue(transaction.receiverAccount)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Payment Purpose:</b> {formatValue(transaction.paymentPurpose)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Amount:</b> {formatValue(transaction.amount)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Payment Code:</b> {formatValue(transaction.paymentCode)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Reference Number:</b> {formatValue(transaction.referenceNumber)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1"><b>Loan ID:</b> {formatValue(transaction.loanId)}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1"><b>Date & Time:</b> {formattedDate} at {formattedTime}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <Button variant="contained" onClick={onClose} sx={{ bgcolor: "#F4D03F", color: "#000", "&:hover": { bgcolor: "#F1C40F" } }}>
                        CLOSE
                    </Button>
                    <Button variant="contained" onClick={handleDownloadPDF} sx={{ bgcolor: "#4CAF50", color: "#fff", "&:hover": { bgcolor: "#388E3C" } }}>
                        Print
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetailsModal;