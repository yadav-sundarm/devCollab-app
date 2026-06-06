import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/github`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchGithubData = async (userId) => {
  try {
    const response = await api.get(`/${userId}/userProfile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
};
