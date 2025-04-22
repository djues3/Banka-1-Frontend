import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from "@mui/material";
import { fetchAccountsForUser, submitLoanRequest } from "../../services/AxiosBanking";
import {toast, ToastContainer} from "react-toastify";
import {useAuth} from "../../context/AuthContext";

const LoanRequestModal = ({ open, onClose }) => {
  const [loanType, setLoanType] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [currencyType, setCurrencyType] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [numberOfInstallments, setNumberOfInstallments] = useState("");
  const [interestType, setInterestType] = useState("FIXED");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [employmentDuration, setEmploymentDuration] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const {userInfo} = useAuth();

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const userAccounts = await fetchAccountsForUser(userInfo.id);
        setAccounts(userAccounts);
      } catch (error) {
        console.error("Error fetching user accounts:", error);
      }
    };

    if (open) fetchUserAccounts();
  }, [open]);

  const isFormValid = () => {
    return (
        selectedAccount &&
        loanType &&
        loanAmount &&
        currencyType &&
        loanPurpose &&
        salaryAmount &&
        employmentStatus &&
        employmentDuration &&
        phoneNumber &&
        numberOfInstallments &&
        !isNaN(loanAmount) &&
        !isNaN(salaryAmount) &&
        !isNaN(phoneNumber) &&
        !isNaN(employmentDuration)
    );
  };


  const handleAccountChange = (e) => {
    const accountId = e.target.value;
    const selectedAcc = accounts.find(acc => acc.id === accountId);

    if (selectedAcc) {
      setSelectedAccount(accountId);
      setCurrencyType(selectedAcc.currencyType);
    }
  };
  const handleLoanAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setLoanAmount(value);
    }
  };

  const handleSalaryAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSalaryAmount(value);
    }
  };



  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

   if (/^\+?\d*$/.test(value)) {
    setPhoneNumber(value);
    } 
  };

  const handleEmploymentDurationChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setEmploymentDuration(value);
    }
  };


  const installmentOptions = {
    CASH: [12, 24, 36, 48, 60, 72, 84],
    AUTO: [12, 24, 36, 48, 60, 72, 84],
    STUDENT: [12, 24, 36, 48, 60, 72, 84],
    REFINANCING: [12, 24, 36, 48, 60, 72, 84],
    MORTGAGE: [60, 120, 180, 240, 300, 360]
  };

  const handleSubmit = async () => {
    if (!selectedAccount || !loanType || !loanAmount || !currencyType || !loanPurpose || !salaryAmount || !employmentStatus || !employmentDuration || !phoneNumber || !numberOfInstallments) {
      toast("Please fill in all required fields.");
      return;
    }

    if (isNaN(loanAmount) || isNaN(salaryAmount) || isNaN(phoneNumber) || isNaN(employmentDuration)) {
      toast("Loan Amount, Salary Amount, Phone Number, and Employment Duration must be numbers.");
      return;
    }

    const phoneNumberRegex = /^\+381\d{8}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      toast.error("Invalid phone number. It must start with +381 and be followed by 8 digits.");
      return;
    }

    const requestData = {
      loanPurpose,
      loanType,
      numberOfInstallments: Number(numberOfInstallments),
      interestType,
      loanAmount: Number(loanAmount),
      salaryAmount: Number(salaryAmount),
      employmentStatus,
      employmentDuration: Number(employmentDuration),
      phoneNumber,
      currencyType,
      accountId: selectedAccount,
    };

    console.log("Submitting loan request:", requestData);

    try {
      setLoading(true);
      await submitLoanRequest(requestData);
      toast.success("Loan request submitted successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting loan request:", error);
      toast.error("Failed to submit loan request. Please try again.");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setLoanType("");
    setLoanAmount("");
    setCurrencyType("");
    setLoanPurpose("");
    setNumberOfInstallments("");
    setSalaryAmount("");
    setEmploymentStatus("");
    setEmploymentDuration("");
    setPhoneNumber("");
    setInterestType("");
    setSelectedAccount("");
  };

  return (
      <div>
    <Modal open={open} onClose={() => { resetForm(); onClose(); }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 550, 
          bgcolor: "#1c1f2b",
          color: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: 24
        }}
      >
        <Typography variant="h6" sx={{ mb: 1.5, textAlign: "center", fontWeight: "bold" }}>
          New Loan Request
        </Typography>

        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel>Select account</InputLabel>
          <Select value={selectedAccount} onChange={handleAccountChange}>
            {accounts
                .filter(acc => acc.status !== 'BLOCKED')
                .map(acc => (
                    <MenuItem key={acc.id} value={acc.id}>
                      {acc.accountNumber} ({acc.currencyType})
                    </MenuItem>
                ))}
          </Select>

        </FormControl>

        <TextField label="Currency" value={currencyType} fullWidth disabled sx={{ mb: 1 }} />

        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Loan type</InputLabel>
            <Select value={loanType} onChange={(e) => setLoanType(e.target.value)}>
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="MORTGAGE">Mortgage</MenuItem>
              <MenuItem value="AUTO">Auto</MenuItem>
              <MenuItem value="REFINANCING">Refinancing</MenuItem>
              <MenuItem value="STUDENT">Student</MenuItem>
            </Select>
          </FormControl>
          <TextField
              label="Loan amount"
              value={loanAmount}
              onChange={handleLoanAmountChange}
              fullWidth
          />
        </Box>

        <TextField label="Loan purpose" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)} fullWidth sx={{ mb: 1 }} />

        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel>Number of installments</InputLabel>
          <Select value={numberOfInstallments} onChange={(e) => setNumberOfInstallments(e.target.value)}>
            {installmentOptions[loanType]?.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel>Interest type</InputLabel>
          <Select value={interestType} onChange={(e) => setInterestType(e.target.value)}>
            <MenuItem value="FIXED">Fixed</MenuItem>
            <MenuItem value="VARIABLE">Variable</MenuItem>
          </Select>
        </FormControl>

        <TextField
            label="Salary amount"
            value={salaryAmount}
            onChange={handleSalaryAmountChange}
            fullWidth
        />
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Employment status</InputLabel>
            <Select value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)}>
              <MenuItem value="PERMANENT">Permanent</MenuItem>
              <MenuItem value="TEMPORARY">Temporary</MenuItem>
              <MenuItem value="UNEMPLOYED">Unemployed</MenuItem>
            </Select>
          </FormControl>

          <TextField
              label="Employment duration (months)"
              value={employmentDuration}
              onChange={handleEmploymentDurationChange}
              fullWidth
          />
        </Box>

        <TextField
            label="Phone number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            fullWidth
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="error" onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading || !isFormValid()}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  <ToastContainer position="bottom-right" />
  </div>
  );
};

export default LoanRequestModal;
