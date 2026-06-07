import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/users`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchUserById = async (userId) => {
  try {
    const response = await api.get(`/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await api.patch("/update", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.patch("/changePassword", passwordData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async () => {
  try {
    const response = await api.delete("/delete");
    return response.data;
  } catch (error) {
    throw error;
  }
};
