import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
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
  Typography,
  Pagination,
} from '@mui/material';
import { toast } from 'react-toastify';
import apiTrading, { getSecurities } from '../../services/AxiosTrading';
import { fetchCustomers } from '../../services/AxiosUser';
import Sidebar from '../../components/mainComponents/Sidebar';

const ViewOrderPortal = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [securities, setSecurities] = useState({});
  const [users, setUsers] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiTrading.get(
        `/orders/paged?page=${currentPage}&size=${PAGE_SIZE}&filter_status=${filterStatus}`
      );
      if (response.data.success || response.data.Success) {
        const data = response.data.data || response.data.Data;
        setOrders(data.orders || data.Orders);
        const totalCount = data.totalCount || data.TotalCount || 0;
        setTotalPages(Math.ceil(totalCount / PAGE_SIZE));
      } else {
        toast.error(`Failed to fetch orders: ${response.data.Error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSecuritiesAndUsers = async () => {
    try {
      const secResponse = await getSecurities();
      if (secResponse.success) {
        const securitiesMap = {};
        secResponse.data.forEach((security) => {
          securitiesMap[security.id] = security.ticker;
        });
        setSecurities(securitiesMap);
      }

      const customersResponse = await fetchCustomers();
      const customers = customersResponse.data.rows;
      const usersMap = {};
      customers.forEach((customer) => {
        usersMap[customer.id] = `${customer.firstName} ${customer.lastName}`;
      });
      setUsers(usersMap);
    } catch (error) {
      console.error('Error fetching supplementary data:', error);
      toast.error('Failed to load user information');
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await apiTrading.post(`/orders/${id}/approve`);
      if (response.data.success) {
        toast.success('Order successfully approved');
        fetchOrders();
      } else {
        toast.error(`Failed to approve: ${response.data.Error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await apiTrading.post(`/orders/${id}/decline`);
      if (response.data.success) {
        toast.success('Order successfully declined');
        fetchOrders();
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
  }, [currentPage, , filterStatus]);

  useEffect(() => {
    setCurrentPage(1); // reset on filter change
  }, [filterStatus]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" />;
      case 'approved':
        return <Chip label="Approved" color="success" />;
      case 'declined':
        return <Chip label="Declined" color="error" />;
      case 'done':
        return <Chip label="Done" color="info" />;
      default:
        return <Chip label={status} />;
    }
  };

  return (
    <div>
      <Sidebar />
      <Box
        sx={{
          padding: '32px',
          marginTop: '64px',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <h1 style={{ marginBottom: '16px' }}>Orders</h1>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View and manage all placed orders
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <FormControl sx={{ minWidth: 220 }} size="small">
            <InputLabel id="status-filter-label">Filter by Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => {
                const selectedStatus = e.target.value;
                setFilterStatus(selectedStatus);
                setCurrentPage(1);
              }}
              variant="outlined"
            >
              <MenuItem value="all">All Orders</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="declined">Declined</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} elevation={2}>
              <Table sx={{ minWidth: 650 }} aria-label="orders table">
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
                        <TableCell>
                          {users[order.user_id] || order.user_id}
                        </TableCell>
                        <TableCell>
                          {securities[order.security_id] ||
                            order.security_id}
                        </TableCell>
                        <TableCell>{order.order_type}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.direction.toUpperCase()}
                            color={
                              order.direction === 'buy' ? 'success' : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.contract_size}</TableCell>
                        <TableCell>
                          {formatCurrency(order.price_per_unit)}
                        </TableCell>
                        <TableCell>{order.remaining_parts}</TableCell>
                        <TableCell>{getStatusChip(order.status)}</TableCell>
                        <TableCell>
                          {order.status === 'pending' && (
                            <Box>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                sx={{ mr: 1 }}
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

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
    </div>
  );
};

export default ViewOrderPortal;
