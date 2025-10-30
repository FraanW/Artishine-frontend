// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // use /api for vite proxy or http://localhost:8000
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Optionally add interceptors here (auth header, refresh token handling, etc.)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
