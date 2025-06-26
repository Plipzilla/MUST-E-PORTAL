import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Contact from './pages/Contact/Contact';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './firebase/AuthContext';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { useUserClaims } from './firebase/useUserClaims';
import './App.css';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useUserClaims();
  if (loading) return null;
  return admin ? <>{children}</> : <div style={{padding: 40, textAlign: 'center'}}>Access Denied</div>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/application" element={<div>Application Form - Coming Soon</div>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/programs" element={<div>Programs Page - Coming Soon</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
