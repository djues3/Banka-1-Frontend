import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, FormControl, InputLabel, Select, MenuItem,
    Checkbox, FormControlLabel, TextField, Typography, RadioGroup, Radio
} from '@mui/material';
import { createCustomer, fetchCustomers } from '../../services/AxiosUser';
import { createAccount } from '../../services/AxiosBanking';
import EditModal from '../common/EditModal';
import { toast } from 'react-toastify';
import { fetchCompaniesFromUser } from '../../services/AxiosBanking';

const NewForeignCurrencyAccountModal = ({ open, onClose, accountType, onSuccess }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedOwnerId, setSelectedOwnerId] = useState('');
    const [makeCard, setMakeCard] = useState(false);
    const [startingBalance, setStartingBalance] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState('');
    const currencies = ['EUR', 'CHF', 'USD', 'GBP', 'JPY', 'CAD', 'AUD'];

    const [newCustomer, setNewCustomer] = useState({
        firstName: '',
        lastName: '',
        username: '',
        birthDate: '',
        gender: '',
        email: '',
        phoneNumber: '',
        companyID: null,
        address: ''
    });

    // Creating a new company
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        companyRegistrationNumber: '',
        activityCode: '',
        pib: '',
        address: '',
        ownerID: ''
    });

    useEffect(() => {
        loadCustomers();
        if (isCreateCompanyModalOpen && selectedOwnerId) {
            setNewCompany(prev => ({
                ...prev,
                ownerID: selectedOwnerId
            }));
        } else {
            setSelectedCompanyId('');
        }
    }, [isCreateCompanyModalOpen, selectedOwnerId]);

    useEffect(() => {
        const fetchCompaniesByOwner = async () => {
            if (accountType === "business" && selectedOwnerId) {
                try {
                    const data = await fetchCompaniesFromUser(selectedOwnerId);
                    setCompanies(Array.isArray(data.companies) ? data.companies : [data.companies]);
                } catch (error) {
                    console.error('Failed to fetch companies:', error);
                }
            }
        };

        fetchCompaniesByOwner();
    }, [selectedOwnerId, accountType]);


    const loadCustomers = async () => {
        try {
            const data = await fetchCustomers();
            const rowData = data?.data?.rows || [];

            const formattedCustomers = rowData.map((row) => ({
                id: row.id,
                firstName: row.firstName,
                lastName: row.lastName
            }));

            setCustomers(formattedCustomers);
        } catch (error) {
            console.error("Failed to load customers data:", error);
        }
    };

    const handleConfirm = async () => {
        const accountData = {
            ownerID: selectedOwnerId,
            currency: selectedCurrency.toUpperCase(),
            type: 'FOREIGN_CURRENCY',
            subtype: accountType.toUpperCase(),
            dailyLimit: 0,
            monthlyLimit: 0,
            status: "ACTIVE",
            companyID: null,
            balance: parseFloat(startingBalance),
            createCard: makeCard
        };

        try {
            await createAccount(accountData);
            onClose();
            onSuccess?.();
        } catch (error) {
            console.error('Error creating account:', error);
            toast.error('Failed to create account');
        }
    };

    const handleCreateCustomer = async (customerData) => {
        try {
            const customerPayload = {
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                username: customerData.username,
                birthDate: transformDateForApi(customerData.birthDate),
                gender: customerData.gender,
                email: customerData.email,
                phoneNumber: customerData.phoneNumber,
                address: customerData.address,
                accountInfo: {
                    currency: selectedCurrency.toUpperCase(),
                    type: "FOREIGN_CURRENCY",
                    subtype: accountType.toUpperCase(),
                    dailyLimit: 0,
                    monthlyLimit: 0,
                    status: "ACTIVE",
                    createCard: makeCard,
                    balance: parseFloat(startingBalance),
                }
            };

            const response = await createCustomer(customerPayload);
            const createdCustomerId = response?.customer?.id || response?.data?.customer?.id;

            if (!createdCustomerId) {
                console.error("Customer ID nije pronađen u odgovoru:", response);
                toast.error("Customer was created, but ID was not returned.");
                return;
            }

            setSelectedOwnerId(createdCustomerId);

            // always set companyID, default null
            const companyID = response?.customer?.companyID || response?.data?.customer?.companyID || null;
            setSelectedCompanyId(companyID);

            setNewCompany({
                name: '',
                companyRegistrationNumber: '',
                activityCode: '',
                pib: '',
                address: '',
                ownerID: createdCustomerId
            });

            setIsCreateModalOpen(false);

            if (accountType === 'business') {
                setIsCreateCompanyModalOpen(true);
            } else {
                onClose(); // if it is not business
            }

            toast.success('Customer created successfully');
        } catch (error) {
            toast.error(`Failed to create customer: ${error.message}`);
        }
    };

    /*
        const handleCreateCompany = async (companyData) => {
      try {
        const formattedCompanyData = {
        companyID: companyData.companyID,
          name: companyData.name,
          companyNumber: companyData.companyRegistrationNumber,
          vatNumber: companyData.pib,
          address: companyData.address,
          bas: parseFloat(companyData.activityCode),
          ownerId: companyData.ownerID
        };

        console.log('Sending company data:', formattedCompanyData);

        await createCompany(formattedCompanyData);

        toast.success('Company created successfully!');
        setIsCreateCompanyModalOpen(false);
        onClose(); // zatvara ceo modal
        navigate('/employee-bank-accounts-portal'); // preusmeri
      } catch (error) {
        console.error('Error creating company:', error);
        toast.error(`Failed to create company: ${error.message}`);
      }
    };
    */
    const resetCustomerForm = () => {
        setNewCustomer({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            phoneNumber: '',
            address: '',
            birthDate: '',
            gender: '',
            companyID: null,
        });
    };

    const transformDateForApi = (dateString) => {
        if (!dateString) return null;
        try {
            const [year, month, day] = dateString.split('-'); // ISO format (yyyy-mm-dd)
            return `${day}-${month}-${year}`; // expected format
        } catch (error) {
            console.error('Error converting date:', error);
            return null;
        }
    };

    const customerFormFields = [
        { name: 'firstName', label: 'First Name', required: true },
        { name: 'lastName', label: 'Last Name', required: true },
        { name: 'username', label: 'Username', required: true },
        { name: 'email', label: 'Email', required: true, type: 'email' },
        { name: 'phoneNumber', label: 'Phone Number' },
        { name: 'address', label: 'Address' },
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
        {
            name: 'gender', label: 'Gender', type: 'select', options: [
                { value: 'MALE', label: 'Male' },
                { value: 'FEMALE', label: 'Female' },
                { value: 'OTHER', label: 'Other' }
            ]
        }
    ];

    const createCustomerFormFields = [...customerFormFields];

    const companyFormFields =
        [
            { name: 'name', label: 'Name', required: true },
            { name: 'companyRegistrationNumber', label: 'Registration Number', required: true },
            { name: 'pib', label: 'PIB', required: true },
            { name: 'address', label: 'Address', required: true },
            { name: 'ownerID', label: 'Owner ID', required: true, readOnly: true },
            { name: 'activityCode', label: 'Activity Code', type: 'select', required: true, options: [
                    { value: 1.11, label: 'Cultivation of cereals and legumes (1.11)' },
                    { value: 1.13, label: 'Vegetable growing (1.13)' },
                    { value: 13.1, label: 'Preparation and spinning of textile fibers (13.1)' },
                    { value: 24.1, label: 'Manufacture of iron and steel (24.1)' },
                    { value: 24.2, label: 'Production of steel pipes and fittings (24.2)' },
                    { value: 41.1, label: 'Construction project development (41.1)' },
                    { value: 41.2, label: 'Construction of buildings (41.2)' },
                    { value: 42.11, label: 'Road and highway construction (42.11)' },
                    { value: 42.12, label: 'Railroad and subway construction (42.12)' },
                    { value: 42.13, label: 'Bridge and tunnel construction (42.13)' },
                    { value: 42.21, label: 'Construction of utility projects for fluids (42.21)' },
                    { value: 42.22, label: 'Construction of utility projects for electricity and telecommunications (42.22)' },
                    { value: 5.1, label: 'Mining of hard coal (5.1)' },
                    { value: 7.1, label: 'Mining of iron ores (7.1)' },
                    { value: 7.21, label: 'Mining of uranium and thorium ores (7.21)' },
                    { value: 8.11, label: 'Quarrying of ornamental and building stone (8.11)' },
                    { value: 8.92, label: 'Extraction of peat (8.92)' },
                    { value: 47.11, label: 'Retail sale in non-specialized stores (47.11)' },
                    { value: 56.1, label: 'Restaurants and mobile food service activities (56.1)' },
                    { value: 62.01, label: 'Computer programming activities (62.01)' },
                    { value: 62.09, label: 'Other information technology and computer service activities (62.09)' },
                    { value: 63.11, label: 'Data processing, hosting and related activities (63.11)' },
                    { value: 64.19, label: 'Other monetary intermediation (64.19)' },
                    { value: 64.91, label: 'Financial leasing (64.91)' },
                    { value: 64.2, label: 'Activities of holding companies (64.2)' },
                    { value: 66.3, label: 'Fund management activities (66.3)' },
                    { value: 65.2, label: 'Reinsurance (65.2)' },
                    { value: 65.11, label: 'Life insurance (65.11)' },
                    { value: 65.12, label: 'Non-life insurance (65.12)' },
                    { value: 66.21, label: 'Risk and damage evaluation (66.21)' },
                    { value: 68.1, label: 'Buying and selling of own real estate (68.1)' },
                    { value: 68.2, label: 'Renting and operating of own or leased real estate (68.2)' },
                    { value: 53.1, label: 'Postal activities under universal service obligation (53.1)' },
                    { value: 53.2, label: 'Other postal and courier activities (53.2)' },
                    { value: 85.1, label: 'Pre-primary education (85.1)' },
                    { value: 85.2, label: 'Primary education (85.2)' },
                    { value: 86.1, label: 'Hospital activities (86.1)' },
                    { value: 86.21, label: 'General medical practice activities (86.21)' },
                    { value: 86.22, label: 'Specialist medical practice activities (86.22)' },
                    { value: 86.9, label: 'Other human health activities (86.9)' },
                    { value: 84.12, label: 'Regulation of the activities of providing health care, education, cultural services and other social services (84.12)' },
                    { value: 90.01, label: 'Performing arts (90.01)' },
                    { value: 90.02, label: 'Support activities to performing arts (90.02)' },
                    { value: 90.04, label: 'Operation of arts facilities (90.04)' },
                    { value: 93.11, label: 'Operation of sports facilities (93.11)' },
                    { value: 93.13, label: 'Fitness facilities (93.13)' },
                    { value: 93.19, label: 'Other sports activities (93.19)' },
                    { value: 26.11, label: 'Manufacture of electronic components (26.11)' },
                    { value: 27.12, label: 'Manufacture of electricity distribution and control apparatus (27.12)' },
                    { value: 29.1, label: 'Manufacture of motor vehicles (29.1)' }
                ]}
    ];

    const createCompanyFormFields = [
        ...companyFormFields,
    ];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Creating a {accountType} foreign currency account</DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Choose Currency
                </Typography>
                <RadioGroup
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}
                >
                    {currencies.map((currency) => (
                        <FormControlLabel
                            key={currency}
                            value={currency}
                            control={<Radio />}
                            label={currency}
                        />
                    ))}
                </RadioGroup>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={accountType === "business" ? true : makeCard}
                            onChange={(e) => {

                                // you can change only if it is not "business"
                                if (accountType !== "business") {
                                    setMakeCard(e.target.checked);
                                }
                            }}
                            disabled={accountType === "business"}
                        />
                    }
                    label="Make a card"
                    sx={{ mt: 2 }}
                />

                <TextField
                    fullWidth
                    label="Starting Balance"
                    type="number"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(e.target.value)}
                    sx={{ mt: 2 }}
                />

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="customer-label" shrink>
                        Choose a customer
                    </InputLabel>
                    <Select
                        labelId="customer-label"
                        value={selectedOwnerId}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (value === '') {
                                setSelectedOwnerId('');
                                setSelectedCompanyId('');
                            } else {
                                setSelectedOwnerId(value);
                            }
                        }}
                        displayEmpty
                        label="Choose a customer"
                    >
                        <MenuItem value="" >Choose a customer</MenuItem>
                        {customers.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                                {customer.firstName} {customer.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {accountType === "business" && selectedOwnerId && companies.length > 0 && (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="company-label" shrink>
                            Choose a company
                        </InputLabel>
                        <Select
                            labelId="company-label"
                            value={selectedCompanyId}
                            onChange={(e) => setSelectedCompanyId(e.target.value)}
                            displayEmpty
                            label="Choose a company"
                        >
                            <MenuItem value="">Choose a company</MenuItem>
                            {companies.map((company, index) => (
                                <MenuItem key={index} value={company.companyNumber}>
                                    {company.name} (#{company.companyNumber})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}


                <Button
                    variant="outlined"
                    sx={{ mt: 2, width: '100%' }}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Create New Customer
                </Button>

  {accountType === "business" && (
        <>

            <Button
                variant="outlined"
                sx={{ mt: 2, width: '100%' }}
                onClick={() => setIsCreateCompanyModalOpen(true)}
                disabled={!selectedOwnerId}
            >
                Create New Company
            </Button>

            <EditModal
                open={isCreateCompanyModalOpen}
                onClose={() => {
                    setIsCreateCompanyModalOpen(false);
                    setNewCompany({
                        companyID:'',
                        name: '',
                        companyRegistrationNumber: '',
                        activityCode: '',
                        pib: '',
                        address: '',
                        ownerID: ''
                    });
                }}
                data={newCompany}
                formFields={createCompanyFormFields}
                //onSave={handleCreateCompany}
            />
        </>
  )}

            <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() => {handleConfirm()}}
                    disabled={!selectedOwnerId || !startingBalance}
                //|| (accountType === "business" && !selectedCompanyId)}
                >
                    Confirm
                </Button>
            </DialogActions>
            <EditModal
                open={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    resetCustomerForm();
                }}
                data={newCustomer}
                formFields={createCustomerFormFields}
                onSave={handleCreateCustomer}
                title="Create New Customer"
            />

                {accountType === "business" && selectedOwnerId && (
                    <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                        <Button
                            variant="contained"
                            onClick={handleConfirm}
                            disabled={!selectedCompanyId || !startingBalance}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                )}

                {/* 
                <DialogActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActions>
                */}

            </DialogContent>
        </Dialog>
    );
};

export default NewForeignCurrencyAccountModal;