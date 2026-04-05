import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchWithAuth } from "../../api/client";
import { getMyCourses } from "../../api/faculty";
import { useNavigate } from "react-router-dom";

function FacultyDashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileData, courseData] = await Promise.all([
          fetchWithAuth("/auth/me/", token, logout),
          getMyCourses(token, logout),
        ]);

        setProfile(profileData);
        setCourses(courseData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  const faculty = profile?.faculty;
  const courseCount = courses.length;

  return (
    <div className="app-page stack">
      <header className="page-header surface" style={{ padding: 24 }}>
        <div className="page-title">
          <div className="page-kicker">Faculty dashboard</div>
          <h1>Plan classes with less friction.</h1>
          <p className="page-subtitle">
            Review your assigned offerings, open a course, and take attendance from the same workspace.
          </p>
        </div>

        <div className="metric-grid" style={{ minWidth: "min(100%, 420px)" }}>
          <div className="metric-card">
            <div className="metric-label">Assigned courses</div>
            <div className="metric-value">{courseCount}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Faculty member</div>
            <div className="metric-value" style={{ fontSize: "1.1rem" }}>{faculty?.name || profile?.username}</div>
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
            <div className="metric-value" style={{ fontSize: "1.1rem" }}>{faculty?.email}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Department</div>
            <div className="metric-value" style={{ fontSize: "1.1rem" }}>{faculty?.department}</div>
          </div>
        </div>
      </section>

      <section className="card stack">
        <div className="page-title">
          <div className="page-kicker">Course offerings</div>
          <h2>Assigned classes</h2>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">No courses assigned.</div>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-meta">
                  <strong>{course.course_title}</strong>
                  <span className="muted">
                    {course.program} | Sem {course.semester} | Section {course.section}
                  </span>
                  <div className="chip-row">
                    <span className="chip">{course.course_code || "Course"}</span>
                  </div>
                </div>

                <div className="button-row">
                  <button
                    onClick={() => navigate(`/faculty/course/${course.id}`)}
                  >
                    Open
                  </button>

                  <button
                    className="button-secondary"
                    onClick={() => navigate(`/faculty/course/${course.id}/attendance`)}
                  >
                    Attendance
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default FacultyDashboard;