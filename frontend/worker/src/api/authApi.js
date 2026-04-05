import axiosInstance from "./axiosInstance";

export const authApi = {
  sendOtp: (phone) =>
    axiosInstance.post("/auth/send-otp", { phone }),

  verifyOtp: (phone, otp) =>
    axiosInstance.post("/auth/verify-otp", { phone, otp }),
};
