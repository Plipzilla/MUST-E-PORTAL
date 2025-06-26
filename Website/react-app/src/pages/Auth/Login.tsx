import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './Auth.css';

// Helper to map Firebase errors to user-friendly messages
const getFriendlyError = (error: any, context: 'form' | 'google' | 'facebook') => {
  if (!error || !error.code) return 'Something went wrong. Please try again.';
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/popup-closed-by-user':
      return `The ${context === 'google' ? 'Google' : 'Facebook'} sign-in was cancelled.`;
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<'google' | 'facebook' | 'form' | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingButton('form');
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
      setError(getFriendlyError(error, 'form'));
    } finally {
      setLoading(false);
      setLoadingButton(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLoadingButton('google');
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
      setError(getFriendlyError(error, 'google'));
    } finally {
      setLoading(false);
      setLoadingButton(null);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setLoadingButton('facebook');
    setError('');
    const provider = new FacebookAuthProvider();
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
      setError(getFriendlyError(error, 'facebook'));
    } finally {
      setLoading(false);
      setLoadingButton(null);
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
                  disabled={loading && loadingButton === 'form'}
                >
                  {loading && loadingButton === 'form' ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
              
              <div className="form-separator">
                <span>or</span>
              </div>
              
              <div className="social-login">
                <button type="button" className="social-btn google" onClick={handleGoogleSignIn} disabled={loading && loadingButton !== 'google' ? true : loading}>
                  <i className="fab fa-google"></i>
                  {loading && loadingButton === 'google' ? 'Signing in...' : 'Continue with Google'}
                </button>
                <button type="button" className="social-btn facebook" onClick={handleFacebookSignIn} disabled={loading && loadingButton !== 'facebook' ? true : loading}>
                  <i className="fab fa-facebook-f"></i>
                  {loading && loadingButton === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}
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