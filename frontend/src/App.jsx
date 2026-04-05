import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

// dashboards (we assume these exist)
import StudentDashboard from "./pages/student/Dashboard";
import FacultyDashboard from "./pages/faculty/Dashboard";

import AttendancePage from "./pages/faculty/AttendancePage";
import CoursePage from "./pages/faculty/CoursePage";

import AttendanceHistory from "./pages/faculty/AttendanceHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* STUDENT ONLY */}
        <Route
          path="/student/dashboard"
          element={
            <RoleRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </RoleRoute>
          }
        />

        {/* FACULTY ONLY */}
        <Route
          path="/faculty/dashboard"
          element={
            <RoleRoute allowedRoles={["FACULTY"]}>
              <FacultyDashboard />
            </RoleRoute>
          }
        />

        {/* FACULTY COURSE PAGES */}
        <Route
          path="/faculty/course/:id"
          element={
            <RoleRoute allowedRoles={["FACULTY"]}>
              <CoursePage />
            </RoleRoute>
          }/>

          {/* ATTENDANCE PAGE (FACULTY) */}
        <Route
          path="/faculty/course/:id/attendance"
          element={
            <RoleRoute allowedRoles={["FACULTY"]}>
              <AttendancePage  mode ="edit"/>
            </RoleRoute>
          }/>

          <Route
            path="/faculty/course/:id/attendance/view/:date"
            element={<RoleRoute allowedRoles={["FACULTY"]}>
            <AttendancePage  mode ="view"/>
          </RoleRoute>}
            />

          {/* ATTENDANCE HISTORY (FACULTY) */}
        <Route
          path = "/faculty/course/:id/attendance/history"
          element={
            <RoleRoute allowedRoles={["FACULTY"]}>
              <AttendanceHistory />
            </RoleRoute>
          }/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;