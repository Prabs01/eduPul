import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "Student", // default role
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(form);
      console.log("Register response:", data);
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <select
        name="role"
        onChange={handleChange}
        required
        >
        <option value="">Select Role</option>
        <option value="STUDENT">Student</option>
        <option value="FACULTY">Faculty</option>
        </select>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default Register;