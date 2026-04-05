import React, { useState } from "react";
import { useApp } from "./context/AppContext";

const LoginPage = () => {
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const env = import.meta.env.VITE_API_URL;
      const base =
        env && String(env).trim()
          ? String(env).replace(/\/$/, "")
          : typeof window !== "undefined" &&
              (window.location.port === "5174" ||
                window.location.port === "5173")
            ? "http://127.0.0.1:8000/api/v1"
            : `${window.location.origin}/api/v1`;
      const res = await fetch(`${base}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        const d = data?.detail;
        const msg =
          typeof d === "string"
            ? d
            : Array.isArray(d)
              ? d[0]?.msg
              : data?.message;
        throw new Error(msg || "Login failed");
      }

      const d = data.data || data;
      if (d.role !== "manager") {
        setError(
          "This app is for managers only. Use Admin or Worker on the home page."
        );
        return;
      }
      login(
        { email: d.email, name: d.name, role: d.role },
        d.access_token
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Background elements from login.css */}
      <div className="login-bg">
        <div className="login-bg-orb orb-1"></div>
        <div className="login-bg-orb orb-2"></div>
        <div className="login-bg-grid"></div>
      </div>

      <div className="login-left">
        <div className="brand-lockup">
          <div className="brand-icon">🚚</div>
          <span className="brand-name">DevTrails</span>
        </div>

        <div className="login-hero">
          <div className="hero-badge">Safety First</div>
          <h1 className="hero-heading">
            Detect <span className="hero-highlight">Risks</span> <br />
            Deliver Safely.
          </h1>
          <p className="hero-sub">
            Real-time intelligence for curfews, protests, and delivery safety.
          </p>
        </div>

        <div className="login-stats">
          <div className="stat-chip">
            <span className="stat-value">94%</span>
            <span className="stat-label">Verified</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">Live</span>
            <span className="stat-label">Tracking</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@bhimaastra.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="manager123"
                  required
                />
              </div>
            </div>

            {error && <div className="form-error">⚠️ {error}</div>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <div className="spinner white" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;