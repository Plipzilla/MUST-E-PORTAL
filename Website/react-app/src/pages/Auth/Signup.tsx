import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './Auth.css';

// Helper to map Firebase errors to user-friendly messages for signup
const getSignupFriendlyError = (error: any, context: 'form' | 'google' | 'facebook') => {
  if (!error || !error.code) return 'Something went wrong. Please try again.';
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return `The ${context === 'google' ? 'Google' : context === 'facebook' ? 'Facebook' : 'social'} sign up was cancelled.`;
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-up method.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-blocked':
      return 'Popup was blocked. Please allow popups and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

const Signup: React.FC = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [name, setName] = useState('');
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: name
      });
      
      // Clear any previous session data
      sessionStorage.clear();
      
      // Store user info in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: name
      }));

      // Check for admin claim
      const tokenResult = await user.getIdTokenResult();
      const redirectPath = tokenResult.claims.admin ? '/admin' : '/dashboard';
      
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
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Clear any previous session data
      sessionStorage.clear();
      
      // Store user info in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email
      }));
      
      const tokenResult = await user.getIdTokenResult();
      const redirectPath = tokenResult.claims.admin ? '/admin' : '/dashboard';
      
      // Prevent back button access to signup page
      window.history.replaceState(null, '', redirectPath);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      setError(getSignupFriendlyError(error, 'google'));
    } finally {
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
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Clear any previous session data
      sessionStorage.clear();
      
      // Store user info in localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email
      }));
      
      const tokenResult = await user.getIdTokenResult();
      const redirectPath = tokenResult.claims.admin ? '/admin' : '/dashboard';
      
      // Prevent back button access to signup page
      window.history.replaceState(null, '', redirectPath);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      setError(getSignupFriendlyError(error, 'facebook'));
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
                <button className="social-btn google" onClick={handleGoogleSignup} disabled={loading && loadingButton !== 'google' ? true : loading}>
                  <i className="fab fa-google"></i>
                  {loading && loadingButton === 'google' ? 'Creating Account...' : 'Continue with Google'}
                </button>
                <button className="social-btn facebook" onClick={handleFacebookSignup} disabled={loading && loadingButton !== 'facebook' ? true : loading}>
                  <i className="fab fa-facebook-f"></i>
                  {loading && loadingButton === 'facebook' ? 'Creating Account...' : 'Continue with Facebook'}
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