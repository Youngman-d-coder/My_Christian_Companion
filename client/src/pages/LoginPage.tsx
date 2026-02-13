import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      login(response.token, response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title"><span aria-label="Cross symbol">✝</span> Christian Companion</h1>
        <h2 className="auth-subtitle">Welcome Back</h2>
        
        {error && <div className="error-message" role="alert" aria-live="assertive">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form" aria-label="Login form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              autoComplete="email"
              aria-describedby={error ? 'error-message' : undefined}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              autoComplete="current-password"
              aria-describedby={error ? 'error-message' : undefined}
            />
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
