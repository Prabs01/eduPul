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

  const [selectedDate, setSelectedDate] = useState(
    date || new Date().toISOString().split("T")[0]
  );

  // =========================
  // LOAD DATA
  // =========================
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

          console.log("FormattedStudents", formattedStudents);

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
          console.log("Students from API:", records);


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

  // =========================
  // SORT STUDENTS
  // =========================
  const sortedStudents = [...students].sort(
    (a, b) => a.roll_no - b.roll_no
  );

  return (
    <div style={{ padding: 20 }}>
      <h2>
        {isViewMode ? "📊 Attendance View" : "📝 Mark Attendance"}
      </h2>

      {/* DATE PICKER ONLY IN EDIT MODE */}
      {!isViewMode && (
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      )}

      <table border="1" style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {sortedStudents.map((student) => (
            <tr key={student.student_id}>
              <td>{student.roll_no}</td>
              <td>{student.student_name}</td>

              <td>
                {/* ================= VIEW MODE ================= */}
                {isViewMode ? (
                  <b>
                    {student.status === "P"
                      ? "Present"
                      : student.status === "A"
                      ? "Absent"
                      : "Late"}
                  </b>
                ) : (
                  /* ================= EDIT MODE ================= */
                  <>
                    <label>
                      <input
                        type="radio"
                        name={`attendance-${student.student_id}`}
                        checked={student.status === "P"}
                        onChange={() =>
                          handleStatusChange(student.student_id, "P")
                        }
                      />
                      Present
                    </label>

                    <label style={{ marginLeft: 10 }}>
                      <input
                        type="radio"
                        name={`attendance-${student.student_id}`}
                        checked={student.status === "A"}
                        onChange={() =>
                          handleStatusChange(student.student_id, "A")
                        }
                      />
                      Absent
                    </label>

                    <label style={{ marginLeft: 10 }}>
                      <input
                        type="radio"
                        name={`attendance-${student.student_id}`}
                        checked={student.status === "L"}
                        onChange={() =>
                          handleStatusChange(student.student_id, "L")
                        }
                      />
                      Late
                    </label>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= SAVE BUTTON ================= */}
      {!isViewMode && (
        <button onClick={submit} style={{ marginTop: 20 }}>
          💾 Save Attendance
        </button>
      )}
    </div>
  );
}

export default AttendancePage;