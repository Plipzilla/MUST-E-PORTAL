import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './Auth.css';

const LogoutConfirm: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to home page after successful logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate to home even if logout fails (local state is already cleared)
      navigate('/', { replace: true });
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <main className="page-content">
      <section className="auth-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth-container" style={{ maxWidth: 400, margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}>
          <div className="auth-form" style={{ textAlign: 'center' }}>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button className="btn btn-danger" onClick={handleLogout} style={{ minWidth: 120 }}>
                Yes, log me out
              </button>
              <button className="btn btn-secondary" onClick={handleCancel} style={{ minWidth: 120 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LogoutConfirm; 