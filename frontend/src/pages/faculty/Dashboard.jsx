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

  return (
    <div style={styles.container}>
      <h1>👨‍🏫 Faculty Dashboard</h1>

      {/* PROFILE */}
      <div style={styles.card}>
        <h3>👤 My Account</h3>
        <p><b>Username:</b> {profile.username}</p>
        <p><b>Name:</b> {faculty?.name}</p>
        <p><b>Email:</b> {faculty?.email}</p>
      </div>

      {/* COURSES */}
      <div style={styles.box}>
        <h3>📘 My Course Offerings</h3>

        {courses.length === 0 ? (
          <p>No courses assigned</p>
        ) : (
          courses.map((c) => (
            <div key={c.id} style={styles.courseCard}>
              <div>
                <b>{c.course_title}</b>
                <p>
                  {c.program} | Sem {c.semester} | {c.section}
                </p>
              </div>

              <div style={styles.actions}>
                <button
                  onClick={() =>
                    navigate(`/faculty/course/${c.id}`)
                  }
                >
                  Open
                </button>

                <button
                  onClick={() =>
                    navigate(`/faculty/course/${c.id}/attendance`)
                  }
                >
                  Attendance
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },

  card: {
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  box: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  },

  courseCard: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },
};

export default FacultyDashboard;