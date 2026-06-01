import axiosInstance from "./axiosInstance";

export const createProviderProfile = (data) => {
  return axiosInstance.post("/providers", data);
};

export const getProviders = () => {
  return axiosInstance.get("/providers");
};

export const getProviderById = (id) => {
  return axiosInstance.get(`/providers/${id}`);
};

export const updateProviderProfile = (data) => {
  return axiosInstance.put("/providers/me", data);
};

export const toggleProviderAvailability = () => {
  return axiosInstance.patch("/providers/availability");
};

export const getProviderMe = () => {
  return axiosInstance.get("/providers/me");
};