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

export const applyToProject = async (projectId, applicationData) => {
  try {
    const response = await api.post(`/${projectId}/apply`, applicationData);
    return response.data;
  } catch (error) {
    console.error("Error applying to project:", error);
    throw error;
  }
};

export const getApplicationsByProject = async (projectId) => {
  try {
    const response = await api.get(`/${projectId}/applications`);
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};

export const updateApplicationStatus = async (
  projectId,
  applicationId,
  status,
) => {
  try {
    const response = await api.patch(
      `/${projectId}/applications/${applicationId}`,
      { status },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

export const getMyApplications = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/myApplications`,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw error;
  }
};
