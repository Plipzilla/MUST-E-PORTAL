import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

interface Application {
  id: string;
  title: string;
  faculty: string;
  status: 'pending' | 'review' | 'accepted' | 'rejected';
  submittedDate: string;
  lastUpdated: string;
  applicationId: string;
}

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('Guest User');
  const [applications] = useState<Application[]>([
    {
      id: '1',
      title: 'MSc in Computer Science',
      faculty: 'Faculty of Computing and Information Technology',
      status: 'accepted',
      submittedDate: '15 Aug 2023',
      lastUpdated: '25 Sep 2023',
      applicationId: 'MUST-APP-2023-00125'
    },
    {
      id: '2',
      title: 'Postgraduate Diploma in Education',
      faculty: 'Faculty of Education and Media Studies',
      status: 'review',
      submittedDate: '10 Sep 2023',
      lastUpdated: '18 Sep 2023',
      applicationId: 'MUST-APP-2023-00189'
    },
    {
      id: '3',
      title: 'Weekend MBA Program',
      faculty: 'Faculty of Business and Management Sciences',
      status: 'pending',
      submittedDate: '5 Sep 2023',
      lastUpdated: '12 Sep 2023',
      applicationId: 'MUST-APP-2023-00215'
    }
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setUserName(user.name || user.email);
    }
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'review': return 'In Review';
      case 'pending': return 'Action Needed';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
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
                <h3>{applications.filter(app => app.status === 'pending').length}</h3>
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
                  <option>Pending</option>
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
                  {application.status === 'pending' && (
                    <>
                      <button className="btn-action">
                        <i className="fas fa-upload"></i> Upload Documents
                      </button>
                      <button className="btn-action">
                        <i className="fas fa-info-circle"></i> Details
                      </button>
                    </>
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