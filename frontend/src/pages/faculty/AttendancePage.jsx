import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchWithAuth } from "../../api/client";
import { getCourseDetail, markAttendance} from "../../api/faculty";

function AttendancePage({ mode = "edit" }) {
  const { id, date } = useParams();
  const { token, logout } = useAuth();

  const isViewMode = mode === "view";

  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

const [selectedDate, setSelectedDate] = useState(
    date || new Date().toISOString().split("T")[0]
  );


  useEffect(() => {
    const load = async () => {
      try {
        // ================= VIEW MODE =================
        if (isViewMode) {
          const data = await fetchWithAuth(
            `/academics/attendances/by_date/?offering=${id}&date=${date}`,
            token,
            logout
          );

          setStudents(data);
        }
        // ================= EDIT MODE =================
        else {
          const data = await getCourseDetail(id, token, logout);

          const formattedStudents = data.students || [];

          setStudents(formattedStudents);

          // default all present
          const validStudents = formattedStudents.filter(
            (s) => s.enrollment_id && s.roll_no !== undefined
          );
          
          setStudents(validStudents);
          
          setRecords(
            validStudents.map((s) => ({
              enrollment: s.enrollment_id,
              status: "P",
            }))
          );

        }
      } catch (err) {
        console.error("Error loading attendance:", err);
      }
    };

    load();
  }, [id, date, isViewMode]);

  // =========================
  // EDIT MODE STATUS CHANGE
  // =========================
  const handleStatusChange = (studentId, status) => {
    // update records (API payload)
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.enrollment !== studentId);
      return [...filtered, { enrollment: studentId, status }];
    });

    // update UI state
    setStudents((prev) =>
      prev.map((s) =>
        s.student_id === studentId ? { ...s, status } : s
      )
    );
  };

  // =========================
  // SUBMIT ATTENDANCE
  // =========================
  const submit = async () => {
    try {
      await markAttendance(
        {
          offering: id,
          date: selectedDate,
          records,
        },
        token,
        logout
      );

      alert("Attendance Saved!");
    } catch (err) {
        console.log(records)
      console.error(err);
      alert("Failed to save attendance");
    }
  };

  const sortedStudents = [...students].sort((a, b) =>
    String(a.roll_no).localeCompare(String(b.roll_no), undefined, { numeric: true })
  );

  const getStatus = (enrollmentId) => {
    const record = records.find((item) => item.enrollment === enrollmentId);
    return record?.status || "P";
  };

  const presentCount = records.filter((record) => record.status === "P").length;
  const lateCount = records.filter((record) => record.status === "L").length;
  const absentCount = records.filter((record) => record.status === "A").length;

  return (
    <div className="app-page stack">
      <header className="surface" style={{ padding: 24 }}>
        <div className="page-title">
          <div className="page-kicker">Take attendance</div>
          <h1>Record today&apos;s session</h1>
          <p className="page-subtitle">
            Set the date, mark the status for each student, and save when you are done.
          </p>
        </div>

        <div className="metric-grid" style={{ marginTop: 18 }}>
          <div className="metric-card">
            <div className="metric-label">Present</div>
            <div className="metric-value">{presentCount}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Late</div>
            <div className="metric-value">{lateCount}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Absent</div>
            <div className="metric-value">{absentCount}</div>
          </div>
        </div>
      </header>

      <section className="card stack">
        <label className="field-label" style={{ maxWidth: 260 }}>
          Session date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        {loading ? (
          <div className="empty-state">Loading students...</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Roll no</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student) => {
                  const status = getStatus(student.enrollment_id);

                  return (
                    <tr key={student.student_id}>
                      <td>{student.roll_no}</td>
                      <td>{student.student_name}</td>
                      <td>
                        <div className="status-options">
                          <label className={`status-option ${status === "P" ? "is-active" : ""}`}>
                            <input
                              type="radio"
                              name={`attendance-${student.student_id}`}
                              value="P"
                              checked={status === "P"}
                              onChange={() => handleStatusChange(student.enrollment_id, "P")}
                            />
                            Present
                          </label>

                          <label className={`status-option ${status === "A" ? "is-active" : ""}`}>
                            <input
                              type="radio"
                              name={`attendance-${student.student_id}`}
                              value="A"
                              checked={status === "A"}
                              onChange={() => handleStatusChange(student.enrollment_id, "A")}
                            />
                            Absent
                          </label>

                          <label className={`status-option ${status === "L" ? "is-active" : ""}`}>
                            <input
                              type="radio"
                              name={`attendance-${student.student_id}`}
                              value="L"
                              checked={status === "L"}
                              onChange={() => handleStatusChange(student.enrollment_id, "L")}
                            />
                            Late
                          </label>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="button-row">
          <button onClick={submit} disabled={loading || records.length === 0}>
            Save attendance
          </button>
        </div>
      </section>
    </div>
  );
}

export default AttendancePage;