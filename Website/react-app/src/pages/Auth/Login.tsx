import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Auth.css';

// Helper to map API errors to user-friendly messages
const getFriendlyError = (error: any, context: 'form' | 'google' | 'facebook') => {
  if (!error) return 'Something went wrong. Please try again.';
  
  const message = typeof error === 'string' ? error : error.message || 'Something went wrong. Please try again.';
  
  // Map common Laravel validation errors
  if (message.includes('credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  if (message.includes('email')) {
    return 'Please enter a valid email address.';
  }
  if (message.includes('password')) {
    return 'Password is required.';
  }
  if (message.includes('too many attempts')) {
    return 'Too many attempts. Please try again later.';
  }
  if (context === 'google' && message.includes('cancelled')) {
    return 'The Google sign-in was cancelled.';
  }
  if (context === 'facebook' && message.includes('cancelled')) {
    return 'The Facebook sign-in was cancelled.';
  }
  
  return message;
};

const Login: React.FC = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
      const response = await AuthService.login({ email, password });
      const { user } = response;
      
      // Clear any previous session data
      sessionStorage.clear();
      
      // Store user info for legacy compatibility
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.id.toString(),
        email: user.email,
        name: user.name,
        photoURL: null
      }));
      
      // Set session timestamp
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      
      // Determine redirect path based on user role
      let redirectPath = '/dashboard';
      if (user.roles.includes('admin')) {
        redirectPath = '/admin';
      } else if (user.roles.includes('reviewer')) {
        redirectPath = '/admin'; // Reviewers also go to admin dashboard
      }
      
      // Prevent back button access to login page
      window.history.replaceState(null, '', redirectPath);
      navigate(redirectPath, { replace: true });
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
    
    try {
      await AuthService.loginWithGoogle();
      // The OAuth flow will redirect to Google and back to our callback
    } catch (error: any) {
      setError(getFriendlyError(error, 'google'));
      setLoading(false);
      setLoadingButton(null);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setLoadingButton('facebook');
    setError('');
    
    try {
      await AuthService.loginWithFacebook();
      // The OAuth flow will redirect to Facebook and back to our callback
    } catch (error: any) {
      setError(getFriendlyError(error, 'facebook'));
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
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loadingButton === 'form' ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
              
              <div className="divider">
                <span>Or continue with</span>
              </div>
              
              <div className="social-buttons">
                <button 
                  type="button" 
                  className="btn btn-google"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  {loadingButton === 'google' ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <i className="fab fa-google"></i>
                  )}
                  Google
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-facebook"
                  onClick={handleFacebookSignIn}
                  disabled={loading}
                >
                  {loadingButton === 'facebook' ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <i className="fab fa-facebook-f"></i>
                  )}
                  Facebook
                </button>
              </div>
              
              <div className="auth-footer">
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login; 