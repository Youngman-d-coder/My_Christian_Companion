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
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <span aria-hidden="true">✝</span> Christian Companion
          </h1>
          <nav className="nav" aria-label="Main navigation">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              Home
            </Link>
            <Link 
              to="/bible" 
              className={location.pathname === '/bible' ? 'active' : ''}
              aria-current={location.pathname === '/bible' ? 'page' : undefined}
            >
              Bible
            </Link>
            <Link 
              to="/prayers" 
              className={location.pathname === '/prayers' ? 'active' : ''}
              aria-current={location.pathname === '/prayers' ? 'page' : undefined}
            >
              Prayers
            </Link>
            <Link to="/saints" className={location.pathname === '/saints' ? 'active' : ''}>
              Saints
            <Link to="/hymns" className={location.pathname === '/hymns' ? 'active' : ''}>
              Hymns
            </Link>
            <Link to="/reminders" className={location.pathname === '/reminders' ? 'active' : ''}>
              Reminders
            </Link>
            <Link 
              to="/profile" 
              className={location.pathname === '/profile' ? 'active' : ''}
              aria-current={location.pathname === '/profile' ? 'page' : undefined}
            >
              Profile
            </Link>
          </nav>
          <div className="user-section">
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="btn-logout" aria-label="Log out of your account">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2026 Christian Companion. Built with faith and love.</p>
      </footer>
    </div>
  );
}
