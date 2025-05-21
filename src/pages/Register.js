import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';
import dsl from '../assets/dsl.png';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { email, password });
      window.location = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-container">
          <img src={dsl} alt="Dyal Singh College" className="college-logo" />
        </div>
        <h2 className="auth-title">Create your account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <p>Registeration Page</p>
            <input
              type="email"
              className="form-input"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
        <p>Already have an account?</p>
        <Link to="/" className="auth-link">
          Login
        </Link>
      </div>
    </div>
  );
}