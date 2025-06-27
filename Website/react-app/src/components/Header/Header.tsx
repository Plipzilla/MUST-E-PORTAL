import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../firebase/AuthContext';
import { useUserClaims } from '../../firebase/useUserClaims';

const Header: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const { admin, reviewer, loading: claimsLoading } = useUserClaims();
  const navigate = useNavigate();

  // Debug function to log active state
  const debugActiveState = (isActive: boolean, path: string) => {
    if (isActive) {
      console.log(`Active link detected: ${path}`);
    }
    return `nav-link ${isActive ? 'active' : ''}`;
  };

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
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => debugActiveState(isActive, 'Home')}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/programs" 
                className={({ isActive }) => debugActiveState(isActive, 'Programs')}
              >
                Programs
              </NavLink>
            </li>
            {user && (
              <>
                {admin ? (
                  <li>
                    <NavLink 
                      to="/admin" 
                      className={({ isActive }) => debugActiveState(isActive, 'Admin')}
                    >
                      Admin Panel
                    </NavLink>
                  </li>
                ) : (
                  <>
                    <li>
                      <NavLink 
                        to="/application" 
                        className={({ isActive }) => debugActiveState(isActive, 'Application')}
                      >
                        Application
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => debugActiveState(isActive, 'Dashboard')}
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    {reviewer && (
                      <li>
                        <NavLink 
                          to="/reviewer" 
                          className={({ isActive }) => debugActiveState(isActive, 'Reviewer')}
                        >
                          Reviewer Dashboard
                        </NavLink>
                      </li>
                    )}
                  </>
                )}
              </>
            )}
            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => debugActiveState(isActive, 'Contact')}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {!user ? (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => `btn btn-login ${isActive ? 'active' : ''}`}
              >
                <i className="fas fa-sign-in-alt"></i> Log in
              </NavLink>
              <NavLink 
                to="/signup" 
                className={({ isActive }) => `btn btn-signup ${isActive ? 'active' : ''}`}
              >
                <i className="fas fa-user-plus"></i> Sign up
              </NavLink>
            </>
          ) : (
            <button onClick={() => logout(navigate)} className="btn btn-login">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 