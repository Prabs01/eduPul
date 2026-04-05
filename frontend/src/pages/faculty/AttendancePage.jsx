import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourseDetail, markAttendance } from "../../api/faculty";

function AttendancePage() {
  const { id } = useParams();
  const { token, logout } = useAuth();

  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCourseDetail(id, token, logout);
        const courseStudents = data.students || [];
        setStudents(courseStudents);
        setRecords(
          courseStudents.map((student) => ({
            enrollment: student.enrollment_id,
            status: student.status || "P",
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, token, logout]);

  const toggle = (enrollment, status) => {
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.enrollment !== enrollment);
      return [...filtered, { enrollment, status }];
    });
  };

  const submit = async () => {
    await markAttendance(
      {
        offering: id,
        date,
        records,
      },
      token,
      logout
    );

    alert("Attendance Saved!");
  };

  const handleStatusChange = (enrollmentId, status) => {
    toggle(enrollmentId, status);
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