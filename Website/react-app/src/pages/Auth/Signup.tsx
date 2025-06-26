import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './Auth.css';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: name
      });
      
      // Store user info in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: name
      }));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-content">
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-info">
              <h2>Join MUST E-Admission Portal</h2>
              <p>Create your account to start your application journey at Malawi University of Science and Technology</p>
              <ul>
                <li><i className="fas fa-check-circle"></i> Easy application process</li>
                <li><i className="fas fa-check-circle"></i> Track your admission status</li>
                <li><i className="fas fa-check-circle"></i> Secure document upload</li>
                <li><i className="fas fa-check-circle"></i> Real-time notifications</li>
              </ul>
            </div>
            
            <div className="auth-form">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
              
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                    minLength={6}
                  />
                  <small>Password must be at least 6 characters long</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="checkbox-group">
                    <input type="checkbox" required />
                    <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn-auth"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              
              <div className="form-separator">
                <span>or</span>
              </div>
              
              <div className="social-login">
                <button className="social-btn google">
                  <i className="fab fa-google"></i>
                  Sign up with Google
                </button>
                <button className="social-btn facebook">
                  <i className="fab fa-facebook-f"></i>
                  Sign up with Facebook
                </button>
              </div>
              
              <div className="auth-switch">
                <p>Already have an account? <Link to="/login">Sign in here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup; 