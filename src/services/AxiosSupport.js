import axios from "axios";

const apiSupport = axios.create({
  baseURL: `${process.env.REACT_APP_NOTIFICATION_API_URL || 'http://localhost:8000'}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to all requests
// This interceptor works for all requests made by the apiSupport instance
apiSupport.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Send a message to the chatbot and get a response
// KEEP IN MIND:
// Messages work as a OneShot, meaning that the bot will not remember previous messages 
export const sendChatMessage = async (message) => {
  try {
    const response = await apiSupport.post("/chat", {
      message: message
    });
    return response.data.response;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

export default apiSupport;