import axiosInstance from "./axiosInstance";

// Function to get all packages
export const fetchAllPackages = async () => {
  try {
    const response = await axiosInstance.get(`/packages`);
    return response;
  } catch (error) {
    return error.response;
  }
};

// Function to create a new travel package
export const createPackage = async (data) => {
  try {
    const response = await axiosInstance.post("/packages", data);
    return response;
  } catch (error) {
    return error.response;
  }
};

// Function to delete a package
export const deletePackage = async (packageId) => {
  try {
    const response = await axiosInstance.delete(`/packages/${packageId}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

// Function to update a travel package
export const updatePackage = async (packageId, newData) => {
  try {
    const response = await axiosInstance.put(`/packages/${packageId}`, newData);
    return response;
  } catch (error) {
    return error.response;
  }
};
