import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Auth.css';

// Helper to map API errors to user-friendly messages for signup
const getSignupFriendlyError = (error: any, context: 'form' | 'google' | 'facebook') => {
  if (!error) return 'Something went wrong. Please try again.';
  
  const message = typeof error === 'string' ? error : error.message || 'Something went wrong. Please try again.';
  
  // Map common Laravel validation errors
  if (message.includes('email') && message.includes('taken')) {
    return 'An account already exists with this email.';
  }
  if (message.includes('email')) {
    return 'Please enter a valid email address.';
  }
  if (message.includes('password') && message.includes('characters')) {
    return 'Password must be at least 8 characters long.';
  }
  if (message.includes('password') && message.includes('confirmation')) {
    return 'Password confirmation does not match.';
  }
  if (message.includes('name')) {
    return 'Please enter your full name.';
  }
  if (message.includes('too many attempts')) {
    return 'Too many attempts. Please try again later.';
  }
  if (context === 'google' && message.includes('cancelled')) {
    return 'The Google sign-up was cancelled.';
  }
  if (context === 'facebook' && message.includes('cancelled')) {
    return 'The Facebook sign-up was cancelled.';
  }
  
  return message;
};

const Signup: React.FC = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<'form' | 'google' | 'facebook' | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingButton('form');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      setLoadingButton(null);
      return;
    }

    try {
      const response = await AuthService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: confirmPassword
      });
      
      const { user } = response;
      
      // Clear any previous session data
      sessionStorage.clear();
      
      // Store user info in localStorage for legacy compatibility
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.id.toString(),
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        photoURL: null
      }));

      // Set session timestamp
      localStorage.setItem('sessionTimestamp', Date.now().toString());

      // Determine redirect path based on user role
      let redirectPath = '/dashboard';
      if (user.roles?.includes('admin')) {
        redirectPath = '/admin';
      } else if (user.roles?.includes('reviewer')) {
        redirectPath = '/admin'; // Reviewers also go to admin dashboard
      }
      
      // Prevent back button access to signup page
      window.history.replaceState(null, '', redirectPath);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      setError(getSignupFriendlyError(error, 'form'));
    } finally {
      setLoading(false);
      setLoadingButton(null);
    }
  };

  // Google sign up handler
  const handleGoogleSignup = async () => {
    setLoading(true);
    setLoadingButton('google');
    setError('');
    
    try {
      await AuthService.loginWithGoogle();
      // The OAuth flow will redirect to Google and back to our callback
    } catch (error: any) {
      setError(getSignupFriendlyError(error, 'google'));
      setLoading(false);
      setLoadingButton(null);
    }
  };

  // Facebook sign up handler
  const handleFacebookSignup = async () => {
    setLoading(true);
    setLoadingButton('facebook');
    setError('');
    
    try {
      await AuthService.loginWithFacebook();
      // The OAuth flow will redirect to Facebook and back to our callback
    } catch (error: any) {
      setError(getSignupFriendlyError(error, 'facebook'));
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
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
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
                    minLength={8}
                  />
                  <small className="form-text">Password must be at least 8 characters long</small>
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
                
                <div className="terms-agreement">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loadingButton === 'form' ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              
              <div className="divider">
                <span>Or sign up with</span>
              </div>
              
              <div className="social-buttons">
                <button 
                  type="button" 
                  className="btn btn-google"
                  onClick={handleGoogleSignup}
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
                  onClick={handleFacebookSignup}
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
                <p>Already have an account? <Link to="/login">Sign In</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup; 