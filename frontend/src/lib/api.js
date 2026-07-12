import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create one axios instance and inject the Clerk session token on every
// request via an interceptor set up once from App.jsx (see useApi.js).
export const api = axios.create({ baseURL: API_URL });

export const attachAuthInterceptor = (getToken) => {
  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};
