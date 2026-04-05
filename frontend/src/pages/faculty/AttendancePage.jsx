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

  useEffect(() => {
    const load = async () => {
      const data = await getCourseDetail(id, token, logout);
      setStudents(data.students || []);

      // default all present
      setRecords(
        data.students.map((s) => ({
          enrollment: s.enrollment_id,
          status: "P",
        }))
      );
    };

    load();
  }, [id]);

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

  const sortedStudents = [...students].sort(
    (a, b) => a.roll_no - b.roll_no
  );

  const handleStatusChange = (studentId, status) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.student_id === studentId ? { ...s, status } : s
      )
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📝 Attendance</h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <table border="1" style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Roll no</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>

       
        <tbody>
        {[...students]
            .sort((a, b) => a.roll_no - b.roll_no)
            .map((student) => (
            <tr key={student.student_id}>
                <td>{student.roll_no}</td>
                <td>{student.student_name}</td>
                <td>
                    <label>
                        <input
                        type="radio"
                        name={`attendance-${student.student_id}`}
                        value="P"
                        checked={student.status === "P"}
                        onChange={() => handleStatusChange(student.student_id, "P")}
                        />
                        Present
                    </label>

                    <label style={{ marginLeft: "10px" }}>
                        <input
                        type="radio"
                        name={`attendance-${student.student_id}`}
                        value="A"
                        checked={student.status === "A"}
                        onChange={() => handleStatusChange(student.student_id, "A")}
                        />
                        Absent
                    </label>

                    <label style={{ marginLeft: "10px" }}>
                        <input
                        type="radio"
                        name={`attendance-${student.student_id}`}
                        value="L"
                        checked={student.status === "L"}
                        onChange={() => handleStatusChange(student.student_id, "L")}
                        />
                        Late
                    </label>
                    </td>
            </tr>
            ))}
        </tbody>
      </table>

      <button onClick={submit} style={{ marginTop: 20 }}>
        💾 Save Attendance
      </button>
    </div>
  );
}



export default AttendancePage;