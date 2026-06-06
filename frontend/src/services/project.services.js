import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/projects`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProjects = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post("/", projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.patch(`/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const getProjectById = async (projectId) => {
  try {
    const response = await api.get(`/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const getProjectsByOwner = async () => {
  try {
    const response = await api.get("/myProjects");
    return response.data;
  } catch (error) {
    console.error("Error fetching your project:", error);
    throw error;
  }
};

export const searchProjects = async (query) => {
  try {
    const response = await api.get(`/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching projects:", error);
    throw error;
  }
};
