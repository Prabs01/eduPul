import { apiRequest } from "./client";

export const loginUser = async (data) => {
  const res = await apiRequest("auth/login/", "POST", data);

  if (!res.access) {
    throw new Error(res.detail || "Login failed");
  }

  return res;
};

export const registerUser = async (data) => {
  const res = await apiRequest("auth/register/", "POST", data);

  if (!res.id && !res.username) {
    throw new Error("Registration failed");
  }

  return res;
};