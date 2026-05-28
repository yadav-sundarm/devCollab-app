import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

export const signupService = async (userData) => {
  try {
    const response = await api.post("/signup", userData);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

export const loginService = async (userData) => {
  try {
    const response = await api.post("/login", userData);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
