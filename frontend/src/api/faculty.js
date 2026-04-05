import { fetchWithAuth } from "./client";

export const getFacultyCourses = (token, logout) =>
  fetchWithAuth("/academics/course-offerings/", token, logout);

export const getCourseDetail = (id, token, logout) =>
  fetchWithAuth(`/academics/course-offerings/${id}/`, token, logout);

export const markAttendance = (data, token, logout) =>
  fetchWithAuth(
    "/academics/attendances/mark/",
    token, 
    logout, 
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

export const editAttendance = (data, token, logout) =>
  fetchWithAuth("/academics/attendances/edit/", token, logout, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const getAttendanceByDate = (offeringId, date, token, logout) =>
  fetchWithAuth(`/academics/attendances/?offering=${offeringId}&date=${date}`, token, logout);

export const getAttendanceDates = (offeringId, token, logout) =>
  fetchWithAuth(`/academics/attendances/dates/?offering=${offeringId}`, token, logout);

export const getAttendanceSummary = (id, token, logout) =>
  fetchWithAuth(`/academics/attendances/summary?offering=${id}`, token, logout);

export const getMyCourses = (token, logout) =>
fetchWithAuth("/academics/course-offerings/?mine=true", token, logout);