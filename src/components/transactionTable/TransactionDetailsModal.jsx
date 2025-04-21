import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Typography,
    Button,
    Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

export default function TransactionDetailsModal({ open, onClose, transaction }) {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    if (!open || !transaction) return null;

    const {
        id,
        sender,
        receiver,
        senderAccount,
        receiverAccount,
        paymentPurpose,
        amount,
        currency,
        paymentCode,
        referenceNumber,
        loanId,
        date,
        time
    } = transaction;
    console.log(transaction);

    const displayValue = (value) => {
        return value && value !== 'N/A' ? value : 'Does not exist';
    };

    const downloadPDF = () => {
        const fileName = `Transaction_${id}.pdf`;
        const body = [
            ['Transaction ID', id],
            ['Sender Name', sender],
            ['Sender Account', senderAccount],
            ['Recipient Name', receiver],
            ['Recipient Account', receiverAccount],
            ['Payment Purpose', paymentPurpose],
            ['Amount', amount],
            ['Payment Code', paymentCode || '–'],
            ['Reference Number', referenceNumber || '–'],
            ['Loan ID', isNaN(loanId) ? 'Does not exist' : loanId],
            ['Date & Time', `${date} at ${time}`]
        ];

        const docDefinition = {
            content: [
                { text: 'Transaction Report', style: 'header' },
                { text: '\n' },
                { table: { widths: ['40%', '60%'], body } }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center',
                    marginBottom: 10
                }
            }
        };

        pdfMake.createPdf(docDefinition).download(fileName);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
            <DialogTitle
                sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    backgroundColor: isDarkMode ? '#212128' : '#f0f0f0',
                    color: isDarkMode ? '#fff' : '#000'
                }}
            >
                Transaction Details
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: isDarkMode ? '#212128' : '#fff' }}>
                <Box
                    sx={{
                        p: 3,
                        backgroundColor: isDarkMode ? '#212128' : '#fafafa',
                        borderRadius: 2,
                        border: isDarkMode ? '2px solid #2c2f3f' : '2px solid #ccc'
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography><b>Transaction ID:</b> {id}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Sender Name:</b> {sender}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Sender Account:</b> {senderAccount}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Recipient Name:</b> {receiver}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Recipient Account:</b> {receiverAccount}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Payment Purpose:</b> {displayValue(paymentPurpose)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Amount:</b> {amount}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Payment Code:</b> {displayValue(paymentCode)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Reference Number:</b> {displayValue(referenceNumber)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><b>Loan ID:</b> {isNaN(loanId) ? 'Does not exist' : loanId}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><b>Date & Time:</b> {date} at {time}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        variant='contained'
                        onClick={onClose}
                        sx={{
                            bgcolor: isDarkMode ? '#fcfcfc' : '#222',
                            color: isDarkMode ? '#000' : '#fff',
                            '&:hover': { bgcolor: isDarkMode ? '#e3e3e3' : '#444' }
                        }}
                    >
                        CLOSE
                    </Button>
                    <Button
                        variant='contained'
                        onClick={downloadPDF}
                        sx={{
                            bgcolor: '#4CAF50',
                            color: '#fff',
                            '&:hover': { bgcolor: '#388E3C' }
                        }}
                    >
                        Print
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
