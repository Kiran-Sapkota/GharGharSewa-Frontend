import axiosInstance from "./axiosInstance";

export const registerUser = (data) => {
  return axiosInstance.post("/auth/register", data);
};

export const verifyEmail = (data) => {
  return axiosInstance.post("/auth/verify-email", data);
};

export const resendVerificationOtp = (email) => {
  return axiosInstance.post("/auth/resend-otp", { email });
};

export const forgotPassword = (email) => {
  return axiosInstance.post("/auth/forgot-password", { email });
};

export const resetPassword = (data) => {
  return axiosInstance.post("/auth/reset-password", data);
};

export const loginUser = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const getProfile = () => {
  return axiosInstance.get("/auth/profile");
};
