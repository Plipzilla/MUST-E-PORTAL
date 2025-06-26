import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../firebase/AuthContext';
import { useUserClaims } from '../../firebase/useUserClaims';

const Header: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const { admin, reviewer, loading: claimsLoading } = useUserClaims();

  if (isLoading || claimsLoading) {
    return (
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <i className="fas fa-graduation-cap"></i>
            <h1>MUST E-Admission</h1>
          </div>
          <div className="header-loading">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <i className="fas fa-graduation-cap"></i>
          <h1>MUST E-Admission</h1>
        </div>
        
        <nav>
          <ul>
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/programs" className="nav-link">Programs</Link></li>
            {user && (
              <>
                <li><Link to="/application" className="nav-link">Application</Link></li>
                <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                {admin && <li><Link to="/admin" className="nav-link">Admin Panel</Link></li>}
                {reviewer && <li><Link to="/reviewer" className="nav-link">Reviewer Dashboard</Link></li>}
              </>
            )}
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-login">
                <i className="fas fa-sign-in-alt"></i> Log in
              </Link>
              <Link to="/signup" className="btn btn-signup">
                <i className="fas fa-user-plus"></i> Sign up
              </Link>
            </>
          ) : (
            <button onClick={logout} className="btn btn-login">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 