import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchWithAuth } from "../../api/client";

function StudentDashboard() {
  const { token, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔹 fetch profile
        const profileData = await fetchWithAuth(
          "/auth/me/",
          token,
          logout
        );

        setProfile(profileData);

        // 🔹 fetch attendance summary
        const attendanceData = await fetchWithAuth(
          "/academics/attendances/summary/",
          token,
          logout
        );

        setAttendanceSummary(attendanceData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  const student = profile?.student;
  const courseCount = student?.enrollments?.length || 0;
  const attendanceCount = attendanceSummary.length || 0;

  return (
    <div className="app-page stack">
      <header className="page-header surface" style={{ padding: 24 }}>
        <div className="page-title">
          <div className="page-kicker">Student dashboard</div>
          <h1>Welcome back, {student?.name || profile?.username}</h1>
          <p className="page-subtitle">
            Track your courses and attendance progress from one place.
          </p>
        </div>

        <div className="metric-grid" style={{ minWidth: "min(100%, 420px)" }}>
          <div className="metric-card">
            <div className="metric-label">Courses</div>
            <div className="metric-value">{courseCount}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Attendance items</div>
            <div className="metric-value">{attendanceCount}</div>
          </div>
        </div>
      </header>

      <section className="card stack">
        <div className="page-title">
          <div className="page-kicker">My account</div>
          <h2>Profile</h2>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Username</div>
            <div className="metric-value" style={{ fontSize: "1.1rem" }}>{profile?.username}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Email</div>
            <div className="metric-value" style={{ fontSize: "1.1rem" }}>{student?.email}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Program</div>
            <div className="metric-value" style={{ fontSize: "1.1rem" }}>{student?.program}</div>
          </div>
        </div>
      </section>

      <section className="card stack">
        <div className="page-title">
          <div className="page-kicker">My courses</div>
          <h2>Enrolled classes</h2>
        </div>

        {student?.enrollments?.length > 0 ? (
          <div className="course-grid">
            {student.enrollments.map((enrollment) => (
              <div key={enrollment.id} className="course-card">
                <div className="course-meta">
                  <strong>{enrollment.course}</strong>
                  <span className="muted">Semester {enrollment.semester}</span>
                </div>
                <span className="chip">{enrollment.section || "All sections"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No enrollments found.</div>
        )}
      </section>

      <section className="card stack">
        <div className="page-title">
          <div className="page-kicker">Attendance</div>
          <h2>Summary</h2>
        </div>

        {attendanceSummary.length > 0 ? (
          <div className="summary-grid">
            {attendanceSummary.map((item) => (
              <div key={item.offering} className="summary-card">
                <div className="summary-meta">
                  <strong>{item.course_title}</strong>
                  <span className="muted">Offering {item.offering}</span>
                  <div className="status-row">
                    <span className="chip success">Present {item.present}</span>
                    <span className="chip">Late {item.late}</span>
                    <span className="chip danger">Absent {item.absent}</span>
                  </div>
                </div>

                <div className="metric-card" style={{ minWidth: 140, textAlign: "center" }}>
                  <div className="metric-label">Attendance</div>
                  <div className="metric-value">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No attendance data available yet.</div>
        )}
      </section>
    </div>
  );
}

export default StudentDashboard;