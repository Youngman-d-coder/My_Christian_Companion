import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store';
import './AuthPages.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [denomination, setDenomination] = useState('other');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register({ email, password, name, denomination });
      login(response.token, response.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title"><span aria-hidden="true">✝</span> Christian Companion</h1>
        <h2 className="auth-subtitle">Create Account</h2>
        
        {error && <div id="error-message" className="error-message" role="alert" aria-live="assertive">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form" aria-label="Registration form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
              autoComplete="name"
              aria-describedby={error ? 'error-message' : undefined}
            />
          </div>
          
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
              autoComplete="new-password"
              aria-describedby={error ? 'error-message' : undefined}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="denomination">Denomination</label>
            <select
              id="denomination"
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
            >
              <option value="catholic">Catholic</option>
              <option value="protestant">Protestant</option>
              <option value="orthodox">Orthodox</option>
              <option value="anglican">Anglican</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading} aria-busy={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
