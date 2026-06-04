import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* 🔥 REQUEST INTERCEPTOR (IMPORTANT FIX) */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("TOKEN SENT:", token); // DEBUG

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* RESPONSE INTERCEPTOR */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// LOGIN API
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// VAULT API
export const getCredentials = () => {
  return api.get("/vault/");
};

export default api;