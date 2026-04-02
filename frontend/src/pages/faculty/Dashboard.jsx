import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function FacultyDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // later we will fetch faculty-specific data here
    setLoading(false);
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={styles.container}>
      <h1>Faculty Dashboard</h1>

      {/* Profile Card */}
      <div style={styles.card}>
        <h3>Welcome 👨‍🏫</h3>
        <p><b>Name:</b> {user?.username}</p>
        <p><b>Role:</b> {user?.role}</p>
      </div>

      {/* Quick Stats Grid */}
      <div style={styles.grid}>
        <div style={styles.box}>
          <h3>📘 My Courses</h3>
          <p>Coming soon...</p>
        </div>

        <div style={styles.box}>
          <h3>🧑‍🎓 Students</h3>
          <p>Coming soon...</p>
        </div>

        <div style={styles.box}>
          <h3>📋 Attendance</h3>
          <p>Mark & View Attendance</p>
        </div>

        <div style={styles.box}>
          <h3>📝 Assignments</h3>
          <p>Create & Manage</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
  },

  card: {
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },

  box: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
};

export default FacultyDashboard;