import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Application {
  id: string;
  title: string;
  faculty: string;
  status: 'draft' | 'incomplete' | 'submitted' | 'review' | 'accepted' | 'rejected';
  submittedDate: string;
  lastUpdated: string;
  applicationId: string;
  isDraft?: boolean;
  completionPercentage?: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Guest User');
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check if this is an admin who should be redirected to admin panel
    const adminIntent = localStorage.getItem('admin_login_intent');
    if (adminIntent === 'true') {
      console.log('🔍 DASHBOARD DEBUG - Admin intent detected, redirecting to admin panel');
      localStorage.removeItem('admin_login_intent'); // Clear the flag
      navigate('/admin', { replace: true });
      return;
    }
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setUserName(user.name || user.email);
    }
    loadApplications();
  }, [navigate]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'incomplete': return 'Action Needed';
      case 'submitted': return 'Submitted';
      case 'review': return 'In Review';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const loadApplications = async () => {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) return;

      const user = JSON.parse(currentUser);
      const userId = user.uid || user.email;

      // Load drafts from localStorage
      const drafts = JSON.parse(localStorage.getItem('applicationDrafts') || '[]');
      const userDrafts = drafts.filter((draft: any) => draft.userId === userId);

      // Load submitted applications from localStorage
      const submitted = JSON.parse(localStorage.getItem('submittedApplications') || '[]');
      const userSubmitted = submitted.filter((app: any) => app.userId === userId);

      // Combine and format applications
      const allApplications = [
        ...userDrafts.map((draft: any) => ({
          id: draft.id,
          title: draft.programTitle || 'Application Draft',
          faculty: draft.faculty || 'Not specified',
          status: draft.completionPercentage < 100 ? 'incomplete' : 'draft',
          submittedDate: '',
          lastUpdated: new Date(draft.lastSaved).toLocaleDateString(),
          applicationId: `DRAFT-${draft.id}`,
          isDraft: true,
          completionPercentage: draft.completionPercentage
        })),
        ...userSubmitted.map((app: any) => ({
          id: app.id,
          title: app.programTitle,
          faculty: app.faculty,
          status: app.status,
          submittedDate: new Date(app.submittedDate).toLocaleDateString(),
          lastUpdated: new Date(app.lastUpdated).toLocaleDateString(),
          applicationId: app.applicationId,
          isDraft: false
        }))
      ];

      setApplications(allApplications);
      console.log('Applications loaded from localStorage:', allApplications);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const handleContinueDraft = (applicationId: string) => {
    // Navigate to application form with draft ID
    navigate(`/application?draft=${applicationId}`);
  };

  return (
    <main className="page-content">
      <section className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <div className="user-welcome">
              <h2>Welcome, {userName}</h2>
              <p>Track and manage your applications here</p>
            </div>
            <div className="dashboard-actions">
              <Link to="/application" className="btn btn-primary">
                <i className="fas fa-plus"></i> New Application
              </Link>
            </div>
          </div>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.length}</h3>
                <p>Total Applications</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.filter(app => app.status === 'accepted').length}</h3>
                <p>Accepted</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon orange">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.filter(app => app.status === 'review').length}</h3>
                <p>In Review</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.filter(app => app.status === 'incomplete' || app.status === 'draft').length}</h3>
                <p>Action Needed</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Your Applications</h3>
              <div className="section-filter">
                <select className="form-control">
                  <option>All Applications</option>
                  <option>Drafts</option>
                  <option>Incomplete</option>
                  <option>Submitted</option>
                  <option>In Review</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
            
            {applications.map(application => (
              <div key={application.id} className="application-card">
                <div className="app-header">
                  <div className="app-title">{application.title}</div>
                  <div className={`app-status ${application.status}`}>
                    {getStatusText(application.status)}
                    {application.isDraft && application.completionPercentage !== undefined && (
                      <span className="completion-percentage">
                        {Math.round(application.completionPercentage)}% Complete
                      </span>
                    )}
                  </div>
                </div>
                <p>{application.faculty}</p>
                <div className="app-details">
                  <div className="detail-item">
                    <p>Application ID</p>
                    <h4>{application.applicationId}</h4>
                  </div>
                  <div className="detail-item">
                    <p>Submitted Date</p>
                    <h4>{application.submittedDate}</h4>
                  </div>
                  <div className="detail-item">
                    <p>Status Updated</p>
                    <h4>{application.lastUpdated}</h4>
                  </div>
                </div>
                <div className="app-actions">
                  {application.status === 'accepted' && (
                    <>
                      <button className="btn-action">
                        <i className="fas fa-download"></i> Offer Letter
                      </button>
                      <button className="btn-action">
                        <i className="fas fa-print"></i> Print
                      </button>
                    </>
                  )}
                  {application.status === 'review' && (
                    <button className="btn-action">
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  )}
                  {(application.status === 'incomplete' || application.status === 'draft') && (
                    <>
                      <button 
                        className="btn-action"
                        onClick={() => handleContinueDraft(application.id)}
                      >
                        <i className="fas fa-edit"></i> Continue Application
                      </button>
                      <button className="btn-action">
                        <i className="fas fa-info-circle"></i> Details
                      </button>
                    </>
                  )}
                  {application.status === 'submitted' && (
                    <button className="btn-action">
                      <i className="fas fa-eye"></i> View Application
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Application Deadlines</h3>
            </div>
            <div className="deadline-list">
              <div className="deadline-item">
                <h4>Postgraduate Programs</h4>
                <p>Closing Date: 15 November 2023</p>
                <div className="progress">
                  <div className="progress-bar" style={{width: '75%'}}>75% time remaining</div>
                </div>
              </div>
              <div className="deadline-item">
                <h4>ODL Programs</h4>
                <p>Closing Date: 30 November 2023</p>
                <div className="progress">
                  <div className="progress-bar" style={{width: '85%'}}>85% time remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard; 