import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, userName }) => {
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
            {isLoggedIn && (
              <>
                <li><Link to="/application" className="nav-link">Application</Link></li>
                <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              </>
            )}
            <li><Link to="/contact" className="nav-link">Contact</Link></li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="btn btn-login">
                <i className="fas fa-sign-in-alt"></i> Log in
              </Link>
              <Link to="/signup" className="btn btn-signup">
                <i className="fas fa-user-plus"></i> Sign up
              </Link>
            </>
          ) : (
            <button onClick={onLogout} className="btn btn-login">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 