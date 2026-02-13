import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import './Layout.css';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">✝ Christian Companion</h1>
          <nav className="nav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
            <Link to="/bible" className={location.pathname === '/bible' ? 'active' : ''}>
              Bible
            </Link>
            <Link to="/prayers" className={location.pathname === '/prayers' ? 'active' : ''}>
              Prayers
            </Link>
            <Link to="/saints" className={location.pathname === '/saints' ? 'active' : ''}>
              Saints
            </Link>
            <Link to="/reminders" className={location.pathname === '/reminders' ? 'active' : ''}>
              Reminders
            </Link>
            <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
              Profile
            </Link>
          </nav>
          <div className="user-section">
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2026 Christian Companion. Built with faith and love.</p>
      </footer>
    </div>
  );
}
