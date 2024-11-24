import axiosInstance from "./axiosInstance";

// Handle user login
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response;
  } catch (error) {
    return error.response;
  }
};
