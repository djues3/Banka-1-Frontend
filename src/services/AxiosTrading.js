import axios from "axios";

const apiTrading = axios.create({
  baseURL: `${process.env.REACT_APP_TRADING_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiTrading.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;

        console.log(
            `${config.method.toUpperCase()} ${
                config.url
            } - Token: ${token.substring(0, 20)}...`
        );
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

export const getActuaries = async () => {
  try {
    const response = await apiTrading.get("/actuaries/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching actuaries:", error);
    throw error;
  }
};

export const getActuarialProfits = async () => {
  try {
    const response = await apiTrading.get("/actuaries/profits");
    return response.data;
  } catch (error) {
    console.error("Error fetching actuary profits:", error);
    throw error;
  }
};


export const getActuaryById = async (id) => {
  try {
    const response = await apiTrading.get(`/actuaries/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching actuary with ID ${id}:`, error);
    throw error;
  }
};

export const updateActuaryLimit = async (id, newLimit) => {
  try {
    const response = await apiTrading.put(`/actuaries/${id}/limit`, {
      limit: newLimit,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating limit for actuary ${id}:`, error);
    throw error;
  }
};

export const getSecurities = async () => {
  try {
    const response = await apiTrading.get("/securities");
    return response.data;
  } catch (error) {
    console.error("Error fetching securities:", error);
    throw error;
  }
};

export const getUserSecurities = async (userId) => {
  try {
    const response = await apiTrading.get(`/securities/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching securities for user ${userId}:`, error);
    throw error;
  }
};

export const getTaxForUser = async (userId) => {
  try {
    const response = await apiTrading.get(`/tax/dashboard/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tax for user:`, error);
    throw error;
  }
};

export const getAvailableSecurities = async () => {
  try {
    const response = await apiTrading.get("/securities/available");
    return response.data;
  } catch (error) {
    console.error("Error fetching available securities:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await apiTrading.post("/orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await apiTrading.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling order ${orderId}:`, error);
    throw error;
  }
};

export const updateOrder = async (orderId, action, newQuantity = null) => {
  try {
    const payload = { action };
    if (action === "modify" && newQuantity !== null) {
      payload.newQuantity = newQuantity;
    }
    const response = await apiTrading.put(`/orders/${orderId}/action`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    throw error;
  }
};

export const resetUsedLimit = async (id) => {
  try {
    await apiTrading.put(`/actuaries/${id}/reset-used-limit`);
    return { message: "Used limit reset successfully" };
  } catch (error) {
    console.error("Error resetting used limit:", error);
    throw error;
  }
};

export const fetchSecurities = async () => {
  try {
    const response = await apiTrading.get(`/securities`);
    return response.data;
  } catch (error) {
    console.error("Greška pri dohvatanju hartija:", error);
    throw error;
  }
};

export const fetchPublicSecurities = async () => {
  try {
    const response = await apiTrading.get(`/portfolio/public`);
    return response.data;
  } catch (error) {
    console.error("Greška pri dohvatanju hartija:", error);
    throw error;
  }
};

export const fetchAvailableSecurities = async () => {
  try {
    const response = await apiTrading.get(`/securities/available`);
    return response.data;
  } catch (error) {
    console.error("Greška pri dohvatanju dostupnih hartija:", error);
    throw error;
  }
};

export const updateSecurity = async (ticker, newData) => {
  try {
    const response = await apiTrading.put(`/securities/${ticker}`, newData);
    return response.data;
  } catch (error) {
    console.error(`Greška pri ažuriranju hartije ${ticker}:`, error);
    throw error;
  }
};

export const fetchStock = async (ticker) => {
  try {
    const response = await apiTrading.get(`/stocks/${ticker}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching stock:", error);
    throw error;
  }
};
export const fetchForex = async (ticker) => {
  try {
    const response = await apiTrading.get(`/forex/${ticker}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching forex:", error);
    throw error;
  }
};

export const fetchFuture = async (ticker) => {
  try {
    const response = await apiTrading.get(`/future/${ticker}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching future:", error);
    throw error;
  }
};

export const fetchFutureHistory = async (ticker) => {
  try {
    const response = await apiTrading.get(`/future/${ticker}/history`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching future history:", error);
    throw error;
  }
};
export const fetchForexHistory = async (ticker) => {
  try {
    const response = await apiTrading.get(`/forex/${ticker}/history`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching forex history:", error);
    throw error;
  }
};


export const fetchStockPriceByMonth = async (ticker) => {
  try {
    const response = await apiTrading.get(`/stocks/${ticker}/history`);
    return response.data.data;
  } catch (error) {
    console.error("Error while fetching stock price by month:", error);
    throw error;
  }
};

export const fetchStockPriceByDate = async (ticker, date) => {
  try {
    const response = await apiTrading.get(`/stocks/${ticker}/history/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching stock price by date:", error);
    throw error;
  }
};

export const fetchFirstStockPrice = async (ticker) => {
  try {
    const response = await apiTrading.get(`/stocks/${ticker}/history/first`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching the first stock price:", error);
    throw error;
  }
};

export const fetchOptions = async (ticker) => {
  try {
    const response = await apiTrading.get(`/options/symbol/${ticker}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching the first stock price:", error);
    throw error;
  }
};

export const fetchTaxData = async () => {
  try {
    const response = await apiTrading.get(`/tax`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tax data:", error);
    throw error;
  }
};

export const runTax = async () => {
  try {
    const response = await apiTrading.post("/tax/run");
    console.log("Tax calculation started:", response.data);
  } catch (error) {
    console.error("Error running tax calculation:", error);
    throw error;
  }
};

export const updatePublicCount = async (ticker, publicCount) => {
  try {
    const response = await apiTrading.put("/securities/public-count", {
      ticker,
      publicCount
    });
    return response.data;
  } catch (error) {
    console.error("Error updating public count:", error);
    throw error;
  }
};

export const createOffer = async (payload) => {
  try {
    const response = await apiTrading.post(`/otctrade/offer`, payload);
    return response;
  } catch (error) {
    console.error("Greška kreiranju ponude:", error);
    throw error;
  }
};


export const getActiveOffers = async () => {
  try {
    const response = await apiTrading.get(`/otctrade/offer/active`);
    return response.data;
  } catch (error) {
    console.error("Greška kreiranju ponude:", error);
    throw error;
  }
};

export const counterOffer = async (offer_id, payload) => {
  try {
    const response = await apiTrading.put(`/otctrade/offer/${offer_id}/counter`, payload);
    return response;
  } catch (error) {
    console.error("Greška prilikom slanja counter ponude:", error);
    throw error;
  }
};

export const acceptOffer = async (offer_id) => {
  try {
    return await apiTrading.put(`/otctrade/offer/${offer_id}/accept`);
  } catch (error) {
    console.error("Greška prihvatanju ugovora:", error);
    throw error;
  }
};

export const getContracts = async () => {
  try {
    const response = await apiTrading.get(`/otctrade/option/contracts`);
    return response.data;
  } catch (error) {
    console.error("Greška dohvatanju ugovora:", error);
    throw error;
  }
};

export const executeOffers = async (offer_id) => {
  try {
    return await apiTrading.put(`/otctrade/option/${offer_id}/execute`);
  } catch (error) {
    console.error("Greška executovanju ponude:", error);
    throw error;
  }
};

export const rejectOffer = async (offer_id) => {
  try {
    return await apiTrading.put(`/otctrade/offer/${offer_id}/reject`);
  } catch (error) {
    console.error("Greška prihvatanju ugovora:", error);
    throw error;
  }
};



export default apiTrading;