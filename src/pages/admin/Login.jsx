import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBolt } from '@tabler/icons-react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Pothowar' && password === 'poto#2026') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-logo">
          <IconBolt size={32} />
          <span className="login-logo-text">Pothowar</span>
        </div>

        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Sign in to manage your store products.</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn">Sign In</button>
        </form>

        {/* <div className="login-hint">
          <strong>Demo Credentials:</strong><br />
          Username: <code>admin</code> | Password: <code>123</code>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
