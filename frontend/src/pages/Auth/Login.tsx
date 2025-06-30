import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './Auth.css';

// Helper to map API errors to user-friendly messages
const getFriendlyError = (error: any, context: 'form' | 'google' | 'facebook') => {
  if (!error) return 'Something went wrong. Please try again.';
  
  const message = typeof error === 'string' ? error : error.message || 'Something went wrong. Please try again.';
  
  // Map specific Laravel validation errors
  if (message.includes('The provided credentials are incorrect') || 
      message.includes('credentials') || 
      message.includes('Invalid login')) {
    return '❌ Invalid email or password. Please check your credentials and try again.';
  }
  if (message.includes('The email field is required') || 
      message.includes('email format') ||
      message.includes('valid email')) {
    return '📧 Please enter a valid email address.';
  }
  if (message.includes('The password field is required') || 
      message.includes('password') && message.includes('required')) {
    return '🔒 Password is required. Please enter your password.';
  }
  if (message.includes('too many attempts') || 
      message.includes('rate limit') ||
      message.includes('throttled')) {
    return '⏳ Too many login attempts. Please wait a few minutes before trying again.';
  }
  if (message.includes('user not found') || 
      message.includes('account not found')) {
    return '👤 No account found with this email address. Please check your email or sign up.';
  }
  if (message.includes('account disabled') || 
      message.includes('suspended')) {
    return '🚫 Your account has been disabled. Please contact support for assistance.';
  }
  if (message.includes('email not verified')) {
    return '✉️ Please verify your email address before signing in.';
  }
  if (message.includes('network') || 
      message.includes('connection')) {
    return '🌐 Connection error. Please check your internet connection and try again.';
  }
  if (context === 'google' && message.includes('cancelled')) {
    return 'Google sign-in was cancelled. Please try again.';
  }
  if (context === 'facebook' && message.includes('cancelled')) {
    return 'Facebook sign-in was cancelled. Please try again.';
  }
  
  // Return the original message if it's already user-friendly, otherwise a generic message
  return message.length > 100 ? '❌ Login failed. Please try again or contact support if the problem persists.' : message;
};

const Login: React.FC = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('🔍 LOGIN MOUNT - Login component mounted');
    
    // Add event listener to detect if page gets refreshed
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.warn('🚨 LOGIN DEBUG - Page is about to refresh/unload!');
      console.trace('🚨 LOGIN DEBUG - Page refresh stack trace:');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      console.log('🔍 LOGIN UNMOUNT - Login component unmounting');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<'google' | 'facebook' | 'form' | null>(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string}>({});
  const navigate = useNavigate();
  const { login } = useAuth();

  // Clear error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
  };

  // Client-side validation
  const validateForm = (): boolean => {
    const errors: {email?: string; password?: string} = {};
    
    if (!email.trim()) {
      errors.email = '📧 Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = '📧 Please enter a valid email address';
    }
    
    if (!password.trim()) {
      errors.password = '🔒 Password is required';
    } else if (password.length < 6) {
      errors.password = '🔒 Password must be at least 6 characters long';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // CRITICAL: Prevent all possible causes of page refresh
    e.preventDefault();
    e.stopPropagation();
    
    // Clear any existing errors
    setError('');
    setFieldErrors({});

    // Validate form client-side first
    if (!validateForm()) {
      console.log('🔄 LOGIN DEBUG - Client-side validation failed');
      return;
    }
    
    setLoading(true);
    setLoadingButton('form');

    try {
      console.log('🔄 LOGIN DEBUG - Attempting login with:', { email, password: '***' });
      
      const user = await login({ email: email.trim(), password });
      
      // DEBUG: Log user data to see what we're getting
      console.log('🔄 LOGIN DEBUG - User data:', user);
      console.log('🔄 LOGIN DEBUG - User roles:', user.roles);
      console.log('🔄 LOGIN DEBUG - User roles type:', typeof user.roles);
      
      // Determine redirect path based on user role
      let redirectPath = '/dashboard';
      const hasAdminRole = user.roles?.some((role: any) => role.name === 'admin' || role === 'admin');
      console.log('🔄 LOGIN DEBUG - Has admin role:', hasAdminRole);
      
      if (hasAdminRole) {
        redirectPath = '/admin';
        // Set admin intent flag to persist through any race conditions
        localStorage.setItem('admin_login_intent', 'true');
        console.log('🔄 LOGIN DEBUG - Redirecting to ADMIN panel:', redirectPath);
        console.log('🔄 LOGIN DEBUG - Set admin_login_intent flag');
      } else {
        // Clear any previous admin intent for regular users
        localStorage.removeItem('admin_login_intent');
        console.log('🔄 LOGIN DEBUG - Redirecting to USER dashboard:', redirectPath);
      }
      
      // Use React Router navigation to prevent page refresh
      console.log('🔄 LOGIN DEBUG - Using React Router navigate to:', redirectPath);
      navigate(redirectPath, { replace: true });
      
    } catch (error: any) {
      console.error('🔄 LOGIN ERROR - Login failed:', error);
      const friendlyError = getFriendlyError(error, 'form');
      setError(friendlyError);
      
      // Keep the error visible for at least 5 seconds
      setTimeout(() => {
        if (error === friendlyError) {
          // Only clear if it's still the same error (user hasn't tried again)
        }
      }, 5000);
      
    } finally {
      setLoading(false);
      setLoadingButton(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLoadingButton('google');
    setError('');
    setFieldErrors({});
    
    try {
      // TODO: Implement Google OAuth with Laravel backend
      setError('🔧 Google sign-in is not yet available. Please use email and password to sign in.');
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
    setFieldErrors({});
    
    try {
      // TODO: Implement Facebook OAuth with Laravel backend
      setError('🔧 Facebook sign-in is not yet available. Please use email and password to sign in.');
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
              
              {error && (
                <div className="error-message" style={{ 
                  animation: 'fadeIn 0.3s ease-in',
                  marginBottom: 'var(--spacing-lg)',
                  padding: 'var(--spacing-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '500'
                }}>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`form-control ${fieldErrors.email ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    disabled={loading}
                  />
                  {fieldErrors.email && (
                    <div className="field-error" style={{
                      color: 'var(--danger)',
                      fontSize: 'var(--font-size-xs)',
                      marginTop: 'var(--spacing-xs)',
                      fontWeight: '500'
                    }}>
                      {fieldErrors.email}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`form-control ${fieldErrors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  {fieldErrors.password && (
                    <div className="field-error" style={{
                      color: 'var(--danger)',
                      fontSize: 'var(--font-size-xs)',
                      marginTop: 'var(--spacing-xs)',
                      fontWeight: '500'
                    }}>
                      {fieldErrors.password}
                    </div>
                  )}
                </div>
                
                <div className="remember-forgot">
                  <label className="remember">
                    <input 
                      type="checkbox" 
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--primary)',
                        cursor: 'pointer'
                      }}
                    /> 
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={loading || !email.trim() || !password.trim()}
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loadingButton === 'form' ? (
                    <>
                      <span style={{ display: 'inline-block', marginRight: '8px' }}>⏳</span>
                      Signing In...
                    </>
                  ) : 'Sign In'}
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