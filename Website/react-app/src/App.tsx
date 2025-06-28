import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { AuthProvider, useAuth } from './firebase/AuthContext';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ApplicationForm from './pages/Application/ApplicationForm';
import LogoutConfirm from './pages/Auth/LogoutConfirm';
import './App.css';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isReviewer, isLoading } = useAuth();
  if (isLoading) return null;
  return (isAdmin() || isReviewer()) ? <>{children}</> : <div style={{padding: 40, textAlign: 'center'}}>Access Denied</div>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
