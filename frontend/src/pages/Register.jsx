import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import pulchowkLogo from "../assets/pulchowkLogo.jpeg";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser(form);
      navigate("/", { replace: true });

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page hero-shell">
      <section className="hero-panel register-hero">
        <div className="register-hero-image-wrap">
          <img
            src={pulchowkLogo}
            alt="Pulchowk Campus official logo"
            className="register-hero-image"
          />
        </div>

        <div className="stack">
          <div className="eyebrow">Get started</div>
          <div className="hero-copy">
            <h1>Create your EduPul account.</h1>
            <p>
              Join as a student or faculty member and get immediate access to
              the workflows built for your role.
            </p>
          </div>
        </div>
      </section>

      <section className="card stack">
        <div className="page-title">
          <div className="page-kicker">Create account</div>
          <h2>Join EduPul</h2>
          <p className="page-subtitle">
            Pick a role and finish registration in a few steps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <label className="field-label">
            Username
            <input
              name="username"
              placeholder="Choose a username"
              onChange={handleChange}
              required
            />
          </label>

          <label className="field-label">
            Email
            <input
              name="email"
              type="email"
              placeholder="name@domain.com"
              onChange={handleChange}
              required
            />
          </label>

          <label className="field-label">
            Password
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              onChange={handleChange}
              required
            />
          </label>

          <label className="field-label">
            Role
            <select name="role" onChange={handleChange} value={form.role}>
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
            </select>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="muted" style={{ color: "var(--danger)" }}>{error}</p>}

        <p className="muted">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </section>
    </div>
  );
}

export default Register;