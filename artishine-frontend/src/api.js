// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://api.artishine.in", // Adjust baseURL as needed
  headers: { "Content-Type": "application/json" },
});

// Optionally add interceptors here (auth header, refresh token handling, etc.)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;  
  return config;
});

export default API;
