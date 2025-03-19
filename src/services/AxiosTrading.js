import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiTrading = axios.create({
  baseURL: "http://localhost:3000/trading",
  headers: {
    "Content-Type": "application/json",
  },
});


export const fetchSecurities = async () => {

  try {
    const response = await apiTrading.get(`/securities`);
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
