import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Contact from './pages/Contact/Contact';
import Programs from './pages/Programs/Programs';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { AuthProvider, useAuth } from './auth/AuthContext';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ApplicationForm from './pages/Application/ApplicationForm';
import LogoutConfirm from './pages/Auth/LogoutConfirm';
import AuthDebugComponent, { PageRefreshMonitor, HistoryStatus } from './components/AuthDebugComponent';
import StyleTestComponent from './components/StyleTestComponent';
import { history } from './services/history';
import './App.css';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading, isAuthenticated, user } = useAuth();
  
  console.log('🔍 ADMIN ROUTE DEBUG - isLoading:', isLoading);
  console.log('🔍 ADMIN ROUTE DEBUG - isAuthenticated:', isAuthenticated);
  console.log('🔍 ADMIN ROUTE DEBUG - user:', user);
  console.log('🔍 ADMIN ROUTE DEBUG - isAdmin():', isAdmin());
  
  if (isLoading) {
    console.log('🔍 ADMIN ROUTE DEBUG - Showing loading...');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }
  
  // Check authentication
  if (!isAuthenticated || !user) {
    console.log('🔍 ADMIN ROUTE DEBUG - Access denied - Not authenticated');
    return <Navigate to="/login" replace />;
  }
  
  // Check admin role authorization using AuthContext directly (no race condition)
  if (!isAdmin()) {
    console.log('🔍 ADMIN ROUTE DEBUG - Access denied - Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('🔍 ADMIN ROUTE DEBUG - Access granted - Showing admin panel');
  return <>{children}</>;
}



function UserRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }
  
  // Check authentication
  if (!isAuthenticated || !user) {
    return <div style={{padding: 40, textAlign: 'center'}}>Access Denied - Authentication Required</div>;
  }
  
  return <>{children}</>;
}

function SmartRedirect() {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  if (isAdmin()) {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
}

function NotFound() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div style={{ 
      padding: 60, 
      textAlign: 'center',
      maxWidth: 600,
      margin: '0 auto'
    }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      {isAuthenticated ? (
        <SmartRedirect />
      ) : (
        <Navigate to="/" replace />
      )}
    </div>
  );
}

// Router Wrapper to initialize history helper within Router context
function RouterWrapper() {
  // Initialize history object with navigate and location from React Router
  // This allows navigation from anywhere in the app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  console.log('🔧 ROUTER WRAPPER - History helper initialized:', {
    navigate: !!history.navigate,
    location: !!history.location,
    currentPath: history.location?.pathname
  });

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/application" element={<ApplicationForm />} />
            <Route path="/logout" element={<LogoutConfirm />} />
          </Route>
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/app" element={<SmartRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Debug components - only show in development */}
      <HistoryStatus />
      <PageRefreshMonitor />
      <AuthDebugComponent />
      <StyleTestComponent />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <RouterWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;
