import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import pulchowkLogo from "../assets/pulchowkLogo.jpeg";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
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
      const data = await loginUser(form);

      // ❌ REMOVE all localStorage logic from here
      // ✔ let AuthContext handle it
      login(data);
      


      const role = data.user?.role;

      console.log("Logged in as:", role);

      if (role === "STUDENT") navigate("/student/dashboard", { replace: true });
      else if (role === "FACULTY") navigate("/faculty/dashboard", { replace: true });
  
    } catch (err) {
      // better fallback for API errors
      setError(
        err?.response?.data?.detail ||
        err?.message ||
        "Login failed"
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
          <div className="eyebrow">EduPul</div>
          <div className="hero-copy">
            <h1>Academic operations in one calm workspace.</h1>
            <p>
              Access your role-specific dashboard, review attendance, and keep
              the academic flow organized without bouncing between screens.
            </p>
          </div>
        </div>
      </section>

      <section className="card stack">
        <div className="page-title">
          <div className="page-kicker">Sign in</div>
          <h2>Welcome back</h2>
          <p className="page-subtitle">
            Log in to continue to your EduPul dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-stack">
          <label className="field-label">
            Username
            <input
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
            />
          </label>

          <label className="field-label">
            Password
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="muted" style={{ color: "var(--danger)" }}>{error}</p>}

        <p className="muted">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </div>
  );
}

export default Login;