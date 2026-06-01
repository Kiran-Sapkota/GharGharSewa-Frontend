import axiosInstance from "./axiosInstance";

export const sendChatMessage = (message) => {
  return axiosInstance.post("/chatbot", { message });
};