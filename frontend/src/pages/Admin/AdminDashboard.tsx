import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

interface DashboardStats {
  total_applications: number;
  pending_review: number;
  accepted: number;
  rejected: number;
}

interface Application {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  status: string;
  submitted_at: string;
  program_type: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roles: Array<{ name: string }>;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'applications' | 'users' | 'reports'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // New user form
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Clear admin login intent flag - admin panel loaded successfully
    const adminIntent = localStorage.getItem('admin_login_intent');
    if (adminIntent === 'true') {
      console.log('🔍 ADMIN PANEL DEBUG - Clearing admin_login_intent flag - admin panel loaded successfully');
      localStorage.removeItem('admin_login_intent');
    }
    
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const statsResponse = await axios.get('/admin/dashboard');
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error loading overview:', error);
      setError('Failed to load system overview');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/applications');
      setApplications(response.data.data.data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/users');
      setUsers(response.data.data.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: number, status: string, comments: string = '') => {
    try {
      await axios.put(`/admin/applications/${applicationId}/status`, {
        status,
        comments
      });
      loadApplications(); // Reload applications
    } catch (error) {
      console.error('Error updating application:', error);
      setError('Failed to update application status');
    }
  };

  const updateUserRole = async (userId: number, role: string) => {
    try {
      await axios.put(`/admin/users/${userId}/role`, { role });
      loadUsers(); // Reload users
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role');
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/admin/users', newUser);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      setShowAddUser(false);
      loadUsers(); // Reload users
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`/admin/users/${userId}`);
      loadUsers(); // Reload users
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const handleSectionClick = (section: 'overview' | 'applications' | 'users' | 'reports') => {
    setActiveSection(section);
    setError('');
    
    if (section === 'applications') {
      loadApplications();
    } else if (section === 'users') {
      loadUsers();
    }
  };

  return (
    <main className="admin-panel">
      <div className="admin-container">
        {/* Admin Panel Header */}
        <div className="admin-header">
          <div className="admin-title">
            <h1>🛡️ System Administration Panel</h1>
            <p>Manage MUST E-Admission Portal • Logged in as: <strong>{currentUser?.name}</strong></p>
          </div>
          <div className="admin-status">
            <span className="status-indicator online"></span>
            <span>System Online</span>
          </div>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {/* Admin Sidebar Navigation */}
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <nav className="admin-nav">
              <button 
                className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
                onClick={() => handleSectionClick('overview')}
              >
                <i className="fas fa-chart-pie"></i>
                <span>System Overview</span>
              </button>
              <button 
                className={`nav-item ${activeSection === 'applications' ? 'active' : ''}`}
                onClick={() => handleSectionClick('applications')}
              >
                <i className="fas fa-clipboard-list"></i>
                <span>Application Review</span>
              </button>
              <button 
                className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
                onClick={() => handleSectionClick('users')}
              >
                <i className="fas fa-users-cog"></i>
                <span>User Management</span>
              </button>
              <button 
                className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
                onClick={() => handleSectionClick('reports')}
              >
                <i className="fas fa-file-chart-line"></i>
                <span>Reports & Analytics</span>
              </button>
            </nav>
          </aside>

          {/* Admin Content Area */}
          <div className="admin-content">
            {/* System Overview */}
            {activeSection === 'overview' && (
              <section className="admin-section">
                <div className="section-header">
                  <h2>📊 System Overview</h2>
                  <p>Real-time system metrics and application statistics</p>
                </div>
                
                {loading ? (
                  <div className="loading-state">Loading system data...</div>
                ) : stats ? (
                  <div className="metrics-grid">
                    <div className="metric-card total">
                      <div className="metric-icon">📋</div>
                      <div className="metric-data">
                        <h3>{stats.total_applications}</h3>
                        <p>Total Applications</p>
                      </div>
                    </div>
                    <div className="metric-card pending">
                      <div className="metric-icon">⏳</div>
                      <div className="metric-data">
                        <h3>{stats.pending_review}</h3>
                        <p>Pending Review</p>
                      </div>
                    </div>
                    <div className="metric-card accepted">
                      <div className="metric-icon">✅</div>
                      <div className="metric-data">
                        <h3>{stats.accepted}</h3>
                        <p>Approved</p>
                      </div>
                    </div>
                    <div className="metric-card rejected">
                      <div className="metric-icon">❌</div>
                      <div className="metric-data">
                        <h3>{stats.rejected}</h3>
                        <p>Rejected</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-data">No system data available</div>
                )}

                <div className="quick-actions">
                  <h3>🚀 Quick Actions</h3>
                  <div className="action-grid">
                    <button 
                      className="action-card"
                      onClick={() => handleSectionClick('applications')}
                    >
                      <i className="fas fa-clipboard-check"></i>
                      <span>Review Applications</span>
                    </button>
                    <button 
                      className="action-card"
                      onClick={() => handleSectionClick('users')}
                    >
                      <i className="fas fa-user-plus"></i>
                      <span>Add Administrator</span>
                    </button>
                    <button 
                      className="action-card"
                      onClick={() => handleSectionClick('users')}
                    >
                      <i className="fas fa-users"></i>
                      <span>Manage Users</span>
                    </button>
                    <button 
                      className="action-card"
                      onClick={() => handleSectionClick('reports')}
                    >
                      <i className="fas fa-chart-bar"></i>
                      <span>View Reports</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Application Review */}
            {activeSection === 'applications' && (
              <section className="admin-section">
                <div className="section-header">
                  <h2>📝 Application Review Center</h2>
                  <p>Review and manage student application submissions</p>
                </div>

                {loading ? (
                  <div className="loading-state">Loading applications...</div>
                ) : (
                  <div className="data-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Email</th>
                          <th>Program</th>
                          <th>Status</th>
                          <th>Submitted Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map(app => (
                          <tr key={app.id}>
                            <td className="student-name">{app.user.name}</td>
                            <td>{app.user.email}</td>
                            <td>{app.program_type || 'Not specified'}</td>
                            <td>
                              <span className={`status-tag ${app.status}`}>
                                {app.status}
                              </span>
                            </td>
                            <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                            <td>
                              <div className="action-buttons">
                                {app.status === 'submitted' && (
                                  <>
                                    <button 
                                      onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                      className="btn-approve"
                                    >
                                      ✅ Approve
                                    </button>
                                    <button 
                                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                      className="btn-reject"
                                    >
                                      ❌ Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {applications.length === 0 && (
                      <div className="no-data">No applications to review</div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* User Management */}
            {activeSection === 'users' && (
              <section className="admin-section">
                <div className="section-header">
                  <h2>👥 User Management</h2>
                  <p>Manage system users and administrator accounts</p>
                  <button 
                    onClick={() => setShowAddUser(true)}
                    className="btn-primary"
                  >
                    <i className="fas fa-user-plus"></i> Add New User/Admin
                  </button>
                </div>

                {/* Add User Form */}
                {showAddUser && (
                  <div className="add-user-panel">
                    <h3>➕ Create New Account</h3>
                    <form onSubmit={createUser} className="user-form">
                      <div className="form-grid">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          required
                        />
                        <input
                          type="password"
                          placeholder="Password (min 8 characters)"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          required
                          minLength={8}
                        />
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        >
                          <option value="user">Student/User</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn-create">Create Account</button>
                        <button 
                          type="button" 
                          onClick={() => setShowAddUser(false)}
                          className="btn-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Users Table */}
                {loading ? (
                  <div className="loading-state">Loading users...</div>
                ) : (
                  <div className="data-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Account Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td className="user-name">{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <select
                                value={user.roles[0]?.name || 'user'}
                                onChange={(e) => updateUserRole(user.id, e.target.value)}
                                disabled={user.id === currentUser?.id}
                                className="role-selector"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                            <td>
                              {user.id !== currentUser?.id && (
                                <button 
                                  onClick={() => deleteUser(user.id)}
                                  className="btn-delete"
                                >
                                  🗑️ Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                      <div className="no-data">No users found</div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* Reports & Analytics */}
            {activeSection === 'reports' && (
              <section className="admin-section">
                <div className="section-header">
                  <h2>📈 Reports & Analytics</h2>
                  <p>System reports and detailed analytics</p>
                </div>
                
                <div className="reports-grid">
                  <div className="report-card">
                    <h3>📊 Application Trends</h3>
                    <p>View application submission patterns and trends over time</p>
                    <button className="btn-secondary">Generate Report</button>
                  </div>
                  <div className="report-card">
                    <h3>👤 User Activity</h3>
                    <p>Monitor user engagement and system usage statistics</p>
                    <button className="btn-secondary">View Analytics</button>
                  </div>
                  <div className="report-card">
                    <h3>📋 Program Performance</h3>
                    <p>Analyze application success rates by program type</p>
                    <button className="btn-secondary">View Report</button>
                  </div>
                  <div className="report-card">
                    <h3>🔒 System Logs</h3>
                    <p>Review system activity and security logs</p>
                    <button className="btn-secondary">Access Logs</button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard; 