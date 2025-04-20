import axios from "axios";

const apiUser = axios.create({
  baseURL: `${process.env.REACT_APP_USER_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiIdp = axios.create({
  baseURL: `${process.env.REACT_APP_IDP_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
})



// API functions
export const fetchUserInfo = async () => {
    const api = axios.create({
      baseURL: ``,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })

    try {
        const response = await api.get("/api/whoami");
        return response.data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}


// export const fetchCustomers = async () => {
//   try {
//     const response = await apiUser.get("/api/users/search/customers");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching customers:", error);
//     throw error;
//   }
// };

export const fetchCustomers = async () => {
  try {
    const response = await apiUser.get("/api/users/search/customers", {
      params: {
        page: 0,
        pageSize: 1000 // ili bilo koji broj koji ti odgovara
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const fetchEmployees = async () => {
  try {
    const response = await apiUser.get("/api/users/search/employees");
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const updateEmployeeStatus = async (id, employeeData) => {
  try {
    const response = await apiUser.put(`/api/users/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiUser.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const fetchCustomerById = async (id) => {
  try {
    const response = await apiUser.get(`/api/customer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await apiUser.put(`/api/customer/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    throw error;
  }
};

export const fetchEmployeeById = async (id) => {
  try {
    const response = await apiUser.get(`/api/users/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await apiUser.put(`/api/users/employees/${id}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await apiUser.post("/api/users/reset-password/", {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const setupPassword = async (token, password) => {
  try {
    const response = await apiUser.post("/api/set-password", {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error setting password:", error);
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  return await apiUser.post("/api/users/employees/", employeeData);
};

export const createCustomer = async (customerData) => {
  try {
    const response = await apiUser.post("/api/customer", customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating customer :", error);
    throw error;
  }
};

