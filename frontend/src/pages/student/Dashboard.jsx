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

  return (
    <div style={styles.container}>
      <h1>Student Dashboard</h1>

      {/* ACCOUNT */}
      <div style={styles.card}>
        <h3>👤 My Account</h3>
        <p><b>Username:</b> {profile?.username}</p>
        <p><b>Name:</b> {student?.name}</p>
        <p><b>Email:</b> {student?.email}</p>
        <p><b>Program:</b> {student?.program}</p>
      </div>

      {/* COURSES */}
      <div style={styles.box}>
        <h3>📚 My Courses</h3>

        {student?.enrollments?.length > 0 ? (
          student.enrollments.map((e) => (
            <div key={e.id}>
              <p>
                {e.course} — {e.semester}
              </p>
            </div>
          ))
        ) : (
          <p>No enrollments</p>
        )}
      </div>

      {/* ATTENDANCE SUMMARY */}
      <div style={styles.box}>
        <h3>📊 Attendance Summary</h3>

        {attendanceSummary.length > 0 ? (
          attendanceSummary.map((item) => (
            <div key={item.offering} style={styles.attCard}>
              <p><b>{item.course_title}</b></p>

              <p>Present: {item.present}</p>
              <p>Late: {item.late}</p>
              <p>Absent: {item.absent}</p>
              <p>Total: {item.total}</p>

              <h4>Attendance: {item.percentage}%</h4>
            </div>
          ))
        ) : (
          <p>No attendance data</p>
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
    marginBottom: "20px",
  },

  attCard: {
    background: "#f2f2f2",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
  },
};

export default StudentDashboard;