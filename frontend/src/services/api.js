import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* REQUEST INTERCEPTOR */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

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
    const status = error.response?.status;

    // Unauthorized → force logout
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/*  AUTH APIs */
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

/*  VAULT APIs */
export const getCredentials = () => {
  return api.get("/vault");
};

/*  PASSWORD TOOL APIs */

// Random password generator
export const generatePassword = (length = 16) => {
  return api.get(`/password/generate?length=${length}`);
};

// Personalized password generator
export const generatePersonalizedPassword = (data) => {
  return api.post("/password/personalized", data);
};

// Strength checker
export const checkPasswordStrength = (password) => {
  return api.post("/password/strength", { password });
};

// Expiry checker
export const checkPasswordExpiry = (id) => {
  return api.get(`/password/expiry/${id}`);
};

export default api;