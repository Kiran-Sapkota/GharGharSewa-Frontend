import axiosInstance from "./axiosInstance";

export const getAllUsers = () => {
  return axiosInstance.get("/admin/users");
};

export const getAllProvidersAdmin = () => {
  return axiosInstance.get("/admin/providers");
};

export const getAllBookingsAdmin = () => {
  return axiosInstance.get("/admin/bookings");
};

export const verifyProvider = (providerId) => {
  return axiosInstance.patch(`/admin/providers/${providerId}/verify`);
};

export const unverifyProvider = (providerId) => {
  return axiosInstance.patch(`/admin/providers/${providerId}/unverify`);
};

export const deactivateAccount = (userId) => {
  return axiosInstance.patch(`/admin/users/${userId}/deactivate`);
};

export const reactivateAccount = (userId) => {
  return axiosInstance.patch(`/admin/users/${userId}/reactivate`);
};

export const getAllServicesAdmin = () => {
  return axiosInstance.get("/admin/services");
};

export const createServiceCategory = (payload) => {
  return axiosInstance.post("/admin/services", payload);
};

export const getServiceCategoryById = (id) => {
  return axiosInstance.get(`/admin/services/${id}`);
};

export const updateServiceCategory = (id, payload) => {
  return axiosInstance.put(`/admin/services/${id}`, payload);
};

export const deleteServiceCategory = (id) => {
  return axiosInstance.delete(`/admin/services/${id}`);
};