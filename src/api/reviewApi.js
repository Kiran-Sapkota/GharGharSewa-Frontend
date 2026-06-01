import axiosInstance from "./axiosInstance";

export const submitProviderReview = (data) => {
  return axiosInstance.post("/reviews", data);
};

export const getProviderReviews = (providerId) => {
  return axiosInstance.get(`/reviews/provider/${providerId}`);
};

export const submitUserReview = (data) => {
  return axiosInstance.post("/user-reviews", data);
};

export const getUserReviews = (userId) => {
  return axiosInstance.get(`/user-reviews/user/${userId}`);
};