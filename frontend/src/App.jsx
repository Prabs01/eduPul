import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

// dashboards (we assume these exist)
import StudentDashboard from "./pages/student/Dashboard";
import FacultyDashboard from "./pages/faculty/Dashboard";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;