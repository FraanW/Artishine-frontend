// src/api.js
import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8000", // For local development
  baseURL: "https://api.artishine.in", // live server
  headers: { "Content-Type": "application/json" },
});

// Optionally add interceptors here (auth header, refresh token handling, etc.)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;  
  return config;
});

export default API;
