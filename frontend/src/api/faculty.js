import { apiRequest } from "./client";

export const getFacultyDashboard = () => {
  return apiRequest("faculty/dashboard/");
};

export const getTeachingAssignments = () => {
  return apiRequest("teaching-assignments/");
};