import { apiRequest } from "./client";

export const markAttendance = (data) => {
  return apiRequest("attendances/", "POST", data);
};

export const getAttendance = () => {
  return apiRequest("attendances/");
};