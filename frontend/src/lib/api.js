import { axiosInstance } from "./axios";

export async function login(email, password) {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
}

export async function register(name, email, password) {
  const response = await axiosInstance.post("/auth/register", { name, email, password });
  return response.data;
}

export async function getMe() {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}
