import axiosInstance from "./axiosInstance";

export const getActiveServices = () => {
  return axiosInstance.get("/services");
};
