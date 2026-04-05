import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

function AttendanceHistory() {
  const { id } = useParams();
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchWithAuth(
          `/academics/attendances/dates/?offering=${id}`,
          token,
          logout
        );
        setDates(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    load();
  }, [id, token, logout]);

  const generateDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    const cells = Array.from({ length: firstDay }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      cells.push(dateStr);
    }

    return cells;
  };
  const days = generateDays();
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

return (
  <div className="app-page stack">
    <header className="surface" style={{ padding: 24 }}>
      <div className="page-title">
        <div className="page-kicker">Attendance history</div>
        <h1>{monthLabel}</h1>
        <p className="page-subtitle">
          Review which days already have attendance records for this course.
        </p>
      </div>

      <div className="legend" style={{ marginTop: 16 }}>
        <div className="legend-item"><span className="legend-swatch present" />Recorded</div>
        <div className="legend-item"><span className="legend-swatch absent" />Missing</div>
        <div className="legend-item"><span className="legend-swatch empty" />Blank slot</div>
      </div>
    </header>

    {loading ? (
      <div className="empty-state">Loading history...</div>
    ) : (
      <section className="card">
        <div className="attendance-grid">
          {days.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="calendar-cell is-empty" />;
            }

            const dayNumber = date.split("-")[2];
            const marked = dates.includes(date);

        return (
          <div
            key={date}
            onClick={() => navigate(`/faculty/course/${id}/attendance/view/${date}`)}
            style={{
              ...styles.cell,
              backgroundColor: marked ? "#b6f5c2" : "#f8b6b6",
            }}
          >
            {date.split("-")[2]}
          </div>
        );
      })}
    </div>
  </div>
);
}

export default AttendanceHistory;