import axios from "axios";

// Create an Axios instance with default settings
axios.defaults.withCredentials = true;
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authtoken")}`,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error); // handling error globally
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
