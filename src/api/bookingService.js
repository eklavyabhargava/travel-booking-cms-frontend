import axiosInstance from "./axiosInstance";

// Function to get all packages
export const fetchAllBookings = async () => {
  try {
    const response = await axiosInstance.get(`/bookings`);
    return response;
  } catch (error) {
    return error.response;
  }
};

// Function to update a travel package
export const updateBooking = async (bookingId, newData) => {
  try {
    const response = await axiosInstance.put(`/bookings/${bookingId}`, newData);
    return response;
  } catch (error) {
    return error.response;
  }
};
