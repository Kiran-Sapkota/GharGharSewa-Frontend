import axiosInstance from "./axiosInstance";

export const createBooking = (data) => {
  return axiosInstance.post("/bookings", data);
};

export const getMyBookings = () => {
  return axiosInstance.get("/bookings/my-bookings");
};

export const getProviderBookings = () => {
  return axiosInstance.get("/bookings/provider-bookings");
};

export const updateBookingStatus = (bookingId, status) => {
  return axiosInstance.patch(`/bookings/${bookingId}/status`, { status });
};

export const cancelBooking = (bookingId) => {
  return axiosInstance.patch(`/bookings/${bookingId}/cancel`);
};

export const getBookingById = (bookingId) => {
  return axiosInstance.get(`/bookings/${bookingId}`);
};

export const archiveProviderBooking = (bookingId) => {
  return axiosInstance.patch(`/bookings/${bookingId}/archive`);
};

export const unarchiveProviderBooking = (bookingId) => {
  return axiosInstance.patch(`/bookings/${bookingId}/unarchive`);
};