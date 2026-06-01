import axiosInstance from "./axiosInstance";

export const getRecommendations = (params) => {
  return axiosInstance.get("/recommendations", { params });
};