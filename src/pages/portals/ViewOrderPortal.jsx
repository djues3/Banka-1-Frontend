import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import {toast} from 'react-toastify';
import apiTrading, {getSecurities} from '../../services/AxiosTrading';
import {fetchCustomers} from "../../services/AxiosUser";
import Sidebar from "../../components/mainComponents/Sidebar";

const ViewOrderPortal = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [securities, setSecurities] = useState({});
  const [users, setUsers] = useState({});

  // Fetch all orders based on filter
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiTrading.get(`/orders?filter_status=${filterStatus}`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(`Failed to fetch orders: ${response.data.Error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch securities and users to display their names instead of just IDs
  const fetchSecuritiesAndUsers = async () => {
    try {
      // Fetch securities
      const secResponse = await getSecurities()
      console.log(secResponse)
      if (secResponse.success) {
        const securitiesMap = {};
        let i = 0;
        console.log(secResponse.data)
        secResponse.data.forEach(security => {
          console.log(security)
          securitiesMap[security.id] = security.ticker
        });
        setSecurities(securitiesMap);
        console.log(securitiesMap)
      }

      // Fetch users

      const customersResponse = await fetchCustomers()
      console.log(customersResponse.data)
      if (customersResponse.data) {
        console.log(customersResponse.data.rows)
      }
      const customers = customersResponse.data.rows

      const usersMap = {};

      // Add customers to the map
      customers.forEach(customer => {
        usersMap[customer.id] = `${customer.firstName} ${customer.lastName}`;
      });


      setUsers(usersMap);
    } catch (error) {
      console.error('Error fetching supplementary data:', error);
      toast.error('Failed to load user information');

    }
  };

  // Handle order approval
  const handleApprove = async (id) => {
    try {
      const response = await apiTrading.post(`/orders/${id}/approve`);
      if (response.data.success) {
        toast.success('Order successfully approved');
        fetchOrders(); // Refresh orders
      } else {
        toast.error(`Failed to approve: ${response.data.Error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  // Handle order decline
  const handleDecline = async (id) => {
    try {
      const response = await apiTrading.post(`/orders/${id}/decline`);
      if (response.data.success) {
        toast.success('Order successfully declined');
        fetchOrders(); // Refresh orders
      } else {
        toast.error(`Failed to decline: ${response.data.Error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchSecuritiesAndUsers();
  }, [filterStatus]);


  // Format currency for better display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Get status chip with appropriate color
  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning"/>;
      case 'approved':
        return <Chip label="Approved" color="success"/>;
      case 'declined':
        return <Chip label="Declined" color="error"/>;
      case 'done':
        return <Chip label="Done" color="info"/>;
      default:
        return <Chip label={status}/>;
    }
  };

  return (
    <div>
      <Sidebar/>
      <Container maxWidth="xl" sx={{mt: 16}}>
        <Typography variant="h4" gutterBottom>Order Management Portal</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          View and manage orders as a supervisor
        </Typography>
        <Grid container spacing={3} sx={{mb: 3}}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={filterStatus}
                label="Filter by Status"
                onChange={(e) => setFilterStatus(e.target.value)}
                variant="outlined">
                <MenuItem value="all">All Orders</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="declined">Declined</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" sx={{my: 5}}>
            <CircularProgress/>
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={2}>
            <Table sx={{minWidth: 650}} aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Security</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Direction</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Contract Size</TableCell>
                  <TableCell>Price Per Unit</TableCell>
                  <TableCell>Remaining</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{users[order.user_id] || order.user_id}</TableCell>
                      <TableCell>{securities[order.security_id] || order.security_id}</TableCell>
                      <TableCell>{order.order_type}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.direction.toUpperCase()}
                          color={order.direction === 'buy' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.contract_size}</TableCell>
                      <TableCell>{formatCurrency(order.price_per_unit)}</TableCell>
                      {/*<TableCell>{Math.round(order.quantity * Math.random())}</TableCell>*/}
                      <TableCell>{order.remaining_parts}</TableCell>
                      <TableCell>{getStatusChip(order.status)}</TableCell>
                      <TableCell>
                        {order.status === 'pending' && (
                          <Box>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{mr: 1}}
                              onClick={() => handleApprove(order.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleDecline(order.id)}
                            >
                              Decline
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <Typography variant="body1">
                        No orders found with the selected filter
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{mt: 4}}>
          <Typography variant="h5" gutterBottom>Order Type Legend</Typography>
          <Box component="ul" sx={{listStyleType: 'none', pl: 0}}>
            <Box component="li" sx={{mb: 1}}>
              <Typography variant="body1">
                <strong>Market Order:</strong> Executed immediately at the current market price
              </Typography>
            </Box>
            <Box component="li" sx={{mb: 1}}>
              <Typography variant="body1">
                <strong>Limit Order:</strong> Executed only at specified price or better
              </Typography>
            </Box>
            <Box component="li" sx={{mb: 1}}>
              <Typography variant="body1">
                <strong>Stop Order:</strong> Becomes a market order when a specified price is reached
              </Typography>
            </Box>
            <Box component="li" sx={{mb: 1}}>
              <Typography variant="body1">
                <strong>Stop-Limit Order:</strong> Combines features of stop and limit orders
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{mt: 3, mb: 5}}>
          <Typography variant="h5" gutterBottom>Additional Information</Typography>
          <Typography variant="body1" paragraph>
            <strong>After Hours:</strong> Orders placed less than 4 hours after market close are marked as "After Hours"
            and will execute more slowly.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>All or None (AON):</strong> Orders that must be executed in their entirety or not at all.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Margin:</strong> Orders that utilize credit to execute.
          </Typography>
        </Box>
      </Container>
    </div>);
};

export default ViewOrderPortal;