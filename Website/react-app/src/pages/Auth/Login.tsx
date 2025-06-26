import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user info in localStorage (you can replace this with better state management)
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0]
      }));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0],
        photoURL: user.photoURL
      }));
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Google sign-in failed');
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
              <h2>Welcome Back to MUST E-Admission</h2>
              <p>Sign in to continue your application process and track your admission status</p>
              <ul>
                <li><i className="fas fa-check-circle"></i> Access your applications</li>
                <li><i className="fas fa-check-circle"></i> Track admission status</li>
                <li><i className="fas fa-check-circle"></i> Upload documents</li>
                <li><i className="fas fa-check-circle"></i> Receive notifications</li>
              </ul>
            </div>
            
            <div className="auth-form">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
              
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit}>
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
                  />
                </div>
                
                <div className="remember-forgot">
                  <label className="remember">
                    <input type="checkbox" /> Remember me
                  </label>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                
                <button 
                  type="submit" 
                  className="btn-auth"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
              
              <div className="form-separator">
                <span>or</span>
              </div>
              
              <div className="social-login">
                <button type="button" className="social-btn google" onClick={handleGoogleSignIn} disabled={loading}>
                  <i className="fab fa-google"></i>
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </button>
                <button className="social-btn facebook">
                  <i className="fab fa-facebook-f"></i>
                  Continue with Facebook
                </button>
              </div>
              
              <div className="auth-switch">
                <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login; 