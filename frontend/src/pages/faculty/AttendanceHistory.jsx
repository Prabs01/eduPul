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
        setDates(data);
      } finally {
        setLoading(false);
      }
    };
  
    load();
  }, [id]);

  const generateDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
  
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return dateStr;
    });
  };
  const days = generateDays();

return (
  <div style={{ padding: 20 }}>
    <h2>📅 Attendance History</h2>

    <div style={styles.grid}>
      {days.map((date) => {
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

const styles = {
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "10px",
      marginTop: "20px",
    },
    cell: {
      padding: "15px",
      textAlign: "center",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

export default AttendanceHistory;