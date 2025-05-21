import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import dsl from "../assets/dsl.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { isAdmin, ...otherUserData } = res.data;
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem(
        "user",
        JSON.stringify({ role: isAdmin ? "admin" : "user", ...otherUserData })
      );
      window.location = isAdmin ? "/admin" : "/dashboard";
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <img src={dsl} alt="Dyal Singh College" className="college-logo" />
        </div>
        <h2 className="auth-title">Login to your account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <p>Login Page</p>
            <input
              type="email"
              className="form-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
        </form>
        <p className="create-acc">Don't have an account?</p>
        <Link to="/register" className="auth-link">
          Register
        </Link>
      </div>
    </div>
  );
}
