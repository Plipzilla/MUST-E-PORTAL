import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Check if user is logged in (you'll replace this with Firebase auth later)
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setIsLoggedIn(true);
      setUserName(user.name || user.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <Router>
      <div className="App">
        <Header 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout}
          userName={userName}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes here as we create components */}
          <Route path="/login" element={<div>Login Page - Coming Soon</div>} />
          <Route path="/signup" element={<div>Signup Page - Coming Soon</div>} />
          <Route path="/dashboard" element={<div>Dashboard - Coming Soon</div>} />
          <Route path="/application" element={<div>Application Form - Coming Soon</div>} />
          <Route path="/contact" element={<div>Contact Page - Coming Soon</div>} />
          <Route path="/programs" element={<div>Programs Page - Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
