import axios from "axios";

const apiSupport = axios.create({
  baseURL: `${process.env.REACT_APP_SUPPORT_API_URL || 'http://localhost:8000'}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Send a message to the chatbot and get a response
// KEEP IN MIND:
// Messages work as a OneShot, meaning that the bot will not remember previous messages 
export const sendChatMessage = async (message) => {
  try {
    const response = await apiSupport.post("/chat/", {
      message: message
    });
    return response.data.response;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};
export default apiSupport;