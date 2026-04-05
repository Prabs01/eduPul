import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourseDetail } from "../../api/faculty";

function CoursePage() {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getCourseDetail(id, token, logout);
      setCourse(data);
    };
    load();
  }, [id]);

  if (!course) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📘 {course.course_title}</h2>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate("attendance")}>
          📝 Take Attendance
        </button>

        <button
          onClick={() => navigate("attendance")}
          style={{ marginLeft: 10 }}
        >
          ✏️ Edit Attendance
        </button>

        <button
          onClick={() => navigate("reports")}
          style={{ marginLeft: 10 }}
        >
          📊 Reports
        </button>

        <button
            onClick={() => navigate("attendance/history")}
            style={{ marginLeft: 10 }}
        >Attendance History</button>
      </div>
    </div>
  );
}

export default CoursePage;