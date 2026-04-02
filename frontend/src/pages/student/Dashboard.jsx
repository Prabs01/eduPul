import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function StudentDashboard() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // later we will fetch backend data here
    setLoading(false);
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={styles.container}>
      <h1>Student Dashboard</h1>

      <div style={styles.card}>
        <h3>Welcome 👋</h3>
        <p><b>Name:</b> {user?.username}</p>
        <p><b>Role:</b> {user?.role}</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.box}>
          <h3>📚 Courses</h3>
          <p>Coming soon...</p>
        </div>

        <div style={styles.box}>
          <h3>📊 Attendance</h3>
          <p>Coming soon...</p>
        </div>

        <div style={styles.box}>
          <h3>📝 Assignments</h3>
          <p>Coming soon...</p>
        </div>

        <div style={styles.box}>
          <h3>📈 Performance</h3>
          <p>Coming soon...</p>
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

export default StudentDashboard;