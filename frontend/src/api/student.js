import { apiRequest } from "./client";

export const getStudentDashboard = () => {
  return apiRequest("student/dashboard/");
};

export const getStudentEnrollments = () => {
  return apiRequest("course-enrollments/");
};