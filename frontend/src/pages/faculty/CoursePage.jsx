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
    <div className="app-page stack">
      <header className="surface" style={{ padding: 24 }}>
        <div className="page-title">
          <div className="page-kicker">Course workspace</div>
          <h1>{course.course_title}</h1>
          <p className="page-subtitle">
            {course.program} | Semester {course.semester} | Section {course.section}
          </p>
        </div>

        <div className="chip-row" style={{ marginTop: 16 }}>
          <span className="chip">Open course</span>
          <span className="chip">Attendance</span>
          <span className="chip">History</span>
        </div>
      </header>

      <section className="card stack">
        <div className="page-title">
          <div className="page-kicker">Actions</div>
          <h2>What do you want to do?</h2>
        </div>

        <div className="button-row">
          <button onClick={() => navigate("attendance")}>Take attendance</button>

          <button className="button-secondary" onClick={() => navigate("attendance")}>Edit attendance</button>

          <button className="button-secondary" onClick={() => navigate("reports")}>Reports</button>

          <button className="button-ghost" onClick={() => navigate("attendance/history")}>Attendance history</button>
        </div>
      </section>
    </div>
  );
}

export default CoursePage;