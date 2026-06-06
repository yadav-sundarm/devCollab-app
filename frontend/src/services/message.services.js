import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMessagesByProject = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const getMessagesByUser = async () => {
  try {
    const response = await api.get("/user/messages");
    return response.data;
  } catch (error) {
    console.error("Error fetching user messages:", error);
    throw error;
  }
};
