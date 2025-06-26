import React from 'react';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  return (
    <main className="page-content">
      <section className="admin-dashboard">
        <div className="container">
          <h2>Admin Dashboard</h2>
          <p>Welcome, Admin! Here you can view analytics and manage the portal.</p>
          <div className="admin-analytics-placeholder">
            <h3>Analytics Overview</h3>
            <p>(Analytics and admin tools will appear here.)</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard; 