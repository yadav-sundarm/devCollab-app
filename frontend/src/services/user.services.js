import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/users`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchUserById = async (userId) => {
  try {
    const response = await api.get(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch user error:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.patch("/update", userData);
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

export const deleteUser = async () => {
  try {
    const response = await api.delete("/delete");
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

export const completeUserProfile = async (profileData) => {
  try {
    const response = await api.patch("/complete-profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Complete profile error:", error);
    throw error;
  }
};
