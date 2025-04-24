import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/mainComponents/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "../../styles/NewPaymentPortal.css";
import PaymentResultModal from "../../components/common/PaymentResultModal";
import {
  fetchAccountsForUser,
  fetchRecipients,
  createNewMoneyTransfer,
  verifyOTP,
  createRecipientt,
  getPaymentCodes,
} from "../../services/AxiosBanking";
import {
  Autocomplete,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import OtpModal from "../../components/transferComponents/OtpModal";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import AddFastPayment from "../../components/transactionComponents/AddFastPayment";
import {useAuth} from "../../context/AuthContext";

const NewPaymentPortal = () => {
  const location = useLocation();
  const recipient = location.state?.recipient || {};
  const payerAccountId = recipient?.ownerAccountId || null;


  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentCodes, setPaymentCodes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [fastPaymentOpen, setFastPaymentOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {userInfo} = useAuth();
  const userId = userInfo.id
  const [savedReceiverId, setSavedReceiverId] = useState(null);


  const getFullName = (r) =>
    r?.fullName || `${r.firstName || ""} ${r.lastName || ""}`.trim();

  const [autocompleteInput, setAutocompleteInput] = useState(getFullName(recipient));

  const [newPayment, setNewPayment] = useState({
    payerAccount: "",
    recipientName: recipient?.id ? {
      ...recipient,
      firstName: recipient.firstName || recipient.fullName?.split(" ")[0] || "",
      lastName: recipient.lastName || recipient.fullName?.split(" ").slice(1).join(" ") || ""
    } : "",
    recipientAccount: recipient?.accountNumber || "",
    paymentCode: "289",
    paymentPurpose: "",
    amount: "",
    address: recipient?.address || "",
    referenceNumber: "",
  });


  const isFormValid = () =>
    selectedAccount &&
    newPayment.recipientAccount.trim() !== "" &&
    !isNaN(newPayment.amount) &&
    (
      typeof newPayment.recipientName === "string"
        ? newPayment.recipientName.trim()
        : `${newPayment.recipientName.firstName || ""} ${newPayment.recipientName.lastName || ""}`.trim()
    ) !== "" &&
    newPayment.paymentPurpose.trim() !== "" &&
    newPayment.address.trim() !== "" &&
    newPayment.referenceNumber.trim() !== "";


  const loadAccounts = async () => {
    try {
      const data = await fetchAccountsForUser(userId);
      const activeAccounts = data.filter((acc) => acc.status === "ACTIVE");
      setAccounts(activeAccounts);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  };

  const loadRecipients = async (accountId) => {
    try {
      const data = await fetchRecipients(accountId || selectedAccount?.id);
      setRecipients(data.data.receivers);
    } catch (err) {
      console.error("Failed to fetch recipients:", err);
    }
  };

  const loadPaymentCodes = async () => {
    try {
      const data = await getPaymentCodes();
      setPaymentCodes(data.data.codes);
    } catch (err) {
      console.error("Failed to fetch payment codes:", err);
    }
  };

  useEffect(() => {
    loadAccounts();
    loadPaymentCodes();
  }, []);

  useEffect(() => {
    if (payerAccountId && accounts.length > 0) {
      const foundAccount = accounts.find(
        (acc) => acc.id.toString() === payerAccountId.toString()
      );
      if (foundAccount) {
        setSelectedAccount(foundAccount);
        setDailyLimit(foundAccount.dailyLimit);
        loadRecipients(foundAccount.id);
      }
    }
  }, [payerAccountId, accounts]);

  useEffect(() => {
    if (selectedAccount) loadRecipients();
  }, [selectedAccount]);

  const handleAccountSelection = (accountId) => {
    const selectedAcc = accounts.find((acc) => acc.id.toString() === accountId);
    if (selectedAcc) {
      setSelectedAccount(selectedAcc);
      setDailyLimit(selectedAcc.dailyLimit);
      loadRecipients(selectedAcc.id);
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("All fields are required.");
      return;
    }

    const receiver =
      typeof newPayment.recipientName === "object"
        ? `${newPayment.recipientName.firstName || ""} ${newPayment.recipientName.lastName || ""}`.trim()
        : newPayment.recipientName;

    const receiverId =
      typeof newPayment.recipientName === "object"
        ? newPayment.recipientName.id
        : savedReceiverId;

    const transferData = {
      fromAccountNumber: selectedAccount.accountNumber,
      recipientAccount: newPayment.recipientAccount,
      amount: parseFloat(newPayment.amount),
      receiver,
      adress: newPayment.address,
      payementCode: newPayment.paymentCode,
      payementReference: newPayment.referenceNumber,
      payementDescription: newPayment.paymentPurpose,
      savedReceiverId: receiverId || null,
    };

    try {
      const result = await createNewMoneyTransfer(transferData);
      setTransactionId(result.data.transferId);
      if (result.success) {
        toast.success(result.data.message);
        setIsSuccess(true);
        setPaymentMessage(result.data.message);
      } else {
        toast.error(result.error);
        setIsSuccess(false);
      }
    } catch (error) {
      toast.error("Error creating payment.");
      setIsSuccess(false);
    }

    setShowModal(true);
  };


  const resetForm = () => {
    setNewPayment({
        payerAccount: "",
        recipientName: "",
        recipientAccount: "",
        paymentCode: "289",
        paymentPurpose: "",
        amount: "",
        address: "",
        referenceNumber: "",
    });
    setAutocompleteInput("");
    setSelectedAccount(null);
    setRecipients([]);
    setDailyLimit(null);
    setSavedReceiverId(null);

};

  const handleVerificationConfirm = async (verificationCode) => {
    try {
      const response = await verifyOTP({
        transferId: transactionId,
        otpCode: verificationCode,
      });
      if (response.status === 200) {
        alert("Transaction successfully verified!");
        setShowModal(false);
        resetForm();
      } else {
        alert("Invalid or expired OTP.");
      }
    } catch {
      alert("Error during OTP verification.");
    }

    setShowModal(false);
  };
  const handleFastPaymentSelect = (selectedRecipient) => {
    const fullName =
      selectedRecipient.fullName ||
      `${selectedRecipient.firstName || ""} ${selectedRecipient.lastName || ""}`.trim();

      setNewPayment({
        ...newPayment,
        recipientName: {
          ...selectedRecipient,
          firstName: selectedRecipient.firstName || selectedRecipient.fullName?.split(" ")[0] || "",
          lastName: selectedRecipient.lastName || selectedRecipient.fullName?.split(" ").slice(1).join(" ") || ""
        },
        recipientAccount: selectedRecipient.accountNumber,
        address: selectedRecipient.address || "",
      });


    setAutocompleteInput(fullName);
    setSavedReceiverId(selectedRecipient.id);
  };


  useEffect(() => {
    if (typeof newPayment.recipientName === "object") {
      const name = `${newPayment.recipientName.firstName || ""} ${newPayment.recipientName.lastName || ""}`.trim();
      setAutocompleteInput(name);
    } else {
      setAutocompleteInput(newPayment.recipientName || "");
    }
  }, [newPayment.recipientName]);


  return (
    <div>
      <Sidebar />
      <div className="payment-container">
        <h2>New Payment</h2>

        <form onSubmit={handleCreatePayment} className="payment-form">
          <div className="payer-account">
            <label>Payer Account</label>
            <select
              id="accountSelect"
              value={selectedAccount ? selectedAccount.id : ""}
              onChange={(e) => handleAccountSelection(e.target.value)}
              disabled={payerAccountId !== null}
            >
              <option value="" disabled>
                Select an account
              </option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber} ({account.currencyType})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="recipient-name">
              <label>Recipient Name</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Autocomplete
                  freeSolo
                  options={recipients}
                  getOptionLabel={(option) =>
                    typeof option === "string"
                      ? option
                      : `${option.firstName || ""} ${option.lastName || ""}`.trim()
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?.accountNumber === value?.accountNumber
                  }
                  value={
                    typeof newPayment.recipientName === "string"
                      ? null
                      : newPayment.recipientName
                  }


                  inputValue={
                    typeof newPayment.recipientName === "string"
                      ? newPayment.recipientName
                      : `${newPayment.recipientName.firstName || ""} ${newPayment.recipientName.lastName || ""}`.trim()
                  }
                  
                  onInputChange={
                    event => {
                      const value = event.target.value;
                      setAutocompleteInput(value);
                      setNewPayment({ ...newPayment, recipientName: value });
                    }
                  }
                  
                  onChange={(event, value) => {
                    if (value && typeof value === "object") {
                      const name = `${value.firstName || ""} ${value.lastName || ""}`.trim();
                      setNewPayment({
                        ...newPayment,
                        recipientName: value,
                        recipientAccount: value.accountNumber,
                        address: value.address || "",
                      });
                      setAutocompleteInput(name);
                      setSavedReceiverId(value.id || null);
                    }
                  }}


                  renderInput={(params) => <TextField {...params} label="" />}
                  openOnFocus
                  clearOnBlur={false}
                  sx={{ flex: 1 }}
                />

                <IconButton onClick={() => setFastPaymentOpen(true)} color="primary">
                  <FlashOnIcon />
                </IconButton>
              </div>
            </div>

            <div className="payment-code">
              <label>Payment Code</label>
              <select
                value={newPayment.paymentCode}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, paymentCode: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Select a payment code
                </option>
                {paymentCodes.map((code) => (
                  <option key={code.code} value={code.code}>
                    {code.code} - {code.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="recipient-account">
              <label>Recipient Account</label>
              <input
                type="text"
                value={newPayment.recipientAccount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setNewPayment({ ...newPayment, recipientAccount: value });
                  }
                }}
                required
              />
            </div>

            <div className="payment-purpose">
              <label>Payment Purpose</label>
              <input
                type="text"
                value={newPayment.paymentPurpose}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, paymentPurpose: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="amount-row">
            <div className="amount">
              <label>Amount</label>
              <input
                type="number"
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, amount: e.target.value })
                }
                required
              />
              <span className="currency-display">
                {selectedAccount?.currencyType || ""}
              </span>
            </div>

            <div className="adress">
              <label>Address</label>
              <input
                type="text"
                value={newPayment.address}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, address: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="reference-row">
            <div className="reference-number">
              <label>Reference Number</label>
              <input
                type="text"
                value={newPayment.referenceNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setNewPayment({ ...newPayment, referenceNumber: value });
                  }
                }}
                required
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isFormValid()}
              sx={{ width: "25ch" }}
            >
              Continue
            </Button>
          </div>
        </form>

        <ToastContainer position="bottom-right" />
        <OtpModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleVerificationConfirm}
        />
        <PaymentResultModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          success={isSuccess}
          paymentMessage={paymentMessage}
        />
        <AddFastPayment
          open={fastPaymentOpen}
          onClose={() => setFastPaymentOpen(false)}
          onSelectRecipient={handleFastPaymentSelect}
        />
      </div>
    </div>
  );
};

export default NewPaymentPortal;
