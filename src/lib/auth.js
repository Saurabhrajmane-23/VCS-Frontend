import axiosInstance from "./axios";

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/users/login", credentials);
    const { accessToken, user } = response.data.data;

    // Store access token in localStorage
    localStorage.setItem("accessToken", accessToken);

    return { user };
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axiosInstance.post("/users/logout");
    // Clear access token from localStorage
    localStorage.removeItem("accessToken");
  } catch (error) {
    throw error;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem("accessToken");
};
