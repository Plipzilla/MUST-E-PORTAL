import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useAuth } from '../../firebase/AuthContext';
import img1 from '../../MUST images/Login/building2.jpg';
import img2 from '../../MUST images/Login/lib auds.jpg';
import img3 from '../../MUST images/Login/building.jpg';
import img4 from '../../MUST images/Login/clinic.jpg';

const sliderImages = [img1, img2, img3, img4];

const Home: React.FC = () => {
  const { user, isAdmin, isReviewer } = useAuth();
  const applyNowTarget = user && !isAdmin() && !isReviewer() ? '/application' : '/signup';

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Slider state
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="page-content">
      {/* Hero Section */}
      <section className="hero hero-slider" style={{ backgroundImage: `url(${sliderImages[current]})` }}>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1>Your Future Starts Here at MUST</h1>
          <p>Apply to Malawi University of Science and Technology through our streamlined online admission portal designed for postgraduate, ODL, weekend, and economic students</p>
          <div className="hero-btns">
            <Link to="/signup" className="btn home-btn-primary">
              <i className="fas fa-rocket"></i> Start Your Application
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              <i className="fas fa-user-graduate"></i> Check Admission Status
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Our Portal</h2>
            <p>Experience a seamless admission process designed for modern students</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Time-Saving Process</h3>
              <p>Complete your application in minutes without paperwork or travel</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile-Friendly</h3>
              <p>Apply from anywhere using your smartphone or tablet</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure & Confidential</h3>
              <p>Your data is protected with bank-level security measures</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Steps */}
      <section className="steps">
        <div className="container">
          <div className="section-title">
            <h2>Simple Application Process</h2>
            <p>Follow these easy steps to complete your admission</p>
          </div>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Register with your email and set a secure password</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Select Program</h3>
              <p>Choose from our postgraduate, ODL, or weekend programs</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Complete Profile</h3>
              <p>Fill in your personal and academic information</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Upload Documents</h3>
              <p>Submit required documents through our secure portal</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">5</div>
              <h3>Submit & Track</h3>
              <p>Review and submit your application, then track its status</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="programs">
        <div className="container">
          <div className="section-title">
            <h2>Available Programs</h2>
            <p>Explore our specialized programs designed for diverse learners</p>
          </div>
          
          <div className="programs-grid">
            <div className="program-card">
              <div className="program-header">
                <h3>Postgraduate</h3>
                <div className="price">MK15,000</div>
              </div>
              <div className="program-body">
                <ul>
                  <li><i className="fas fa-check-circle"></i> Masters & PhD Programs</li>
                  <li><i className="fas fa-check-circle"></i> Research Opportunities</li>
                  <li><i className="fas fa-check-circle"></i> Thesis Supervision</li>
                  <li><i className="fas fa-check-circle"></i> Flexible Schedules</li>
                </ul>
                <Link to={applyNowTarget} className="btn-program">Apply Now</Link>
              </div>
            </div>
            
            <div className="program-card">
              <div className="program-header">
                <h3>ODL Programs</h3>
                <div className="price">MK10,000</div>
              </div>
              <div className="program-body">
                <ul>
                  <li><i className="fas fa-check-circle"></i> Fully Online Learning</li>
                  <li><i className="fas fa-check-circle"></i> Self-Paced Courses</li>
                  <li><i className="fas fa-check-circle"></i> Digital Resources</li>
                  <li><i className="fas fa-check-circle"></i> Virtual Support</li>
                </ul>
                <Link to={applyNowTarget} className="btn-program">Apply Now</Link>
              </div>
            </div>
            
            <div className="program-card">
              <div className="program-header">
                <h3>Weekend Programs</h3>
                <div className="price">MK12,000</div>
              </div>
              <div className="program-body">
                <ul>
                  <li><i className="fas fa-check-circle"></i> Friday-Sunday Classes</li>
                  <li><i className="fas fa-check-circle"></i> Working Professionals</li>
                  <li><i className="fas fa-check-circle"></i> Blended Learning</li>
                  <li><i className="fas fa-check-circle"></i> Career Advancement</li>
                </ul>
                <Link to={applyNowTarget} className="btn-program">Apply Now</Link>
              </div>
            </div>

            {/* New Undergraduate (Self-Paying) Card */}
            <div className="program-card">
              <div className="program-header">
                <h3>Undergraduate (Self-Paying)</h3>
                <div className="price">MK8,000</div>
              </div>
              <div className="program-body">
                <ul>
                  <li><i className="fas fa-check-circle"></i> Bachelor's Degree Programs</li>
                  <li><i className="fas fa-check-circle"></i> Flexible Payment Options</li>
                  <li><i className="fas fa-check-circle"></i> Modern Campus Facilities</li>
                  <li><i className="fas fa-check-circle"></i> Student Support Services</li>
                </ul>
                <Link to={applyNowTarget} className="btn-program">Apply Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>5,000+</h3>
              <p>Students Enrolled</p>
            </div>
            <div className="stat-card">
              <h3>50+</h3>
              <p>Programs Available</p>
            </div>
            <div className="stat-card">
              <h3>95%</h3>
              <p>Graduate Employment Rate</p>
            </div>
            <div className="stat-card">
              <h3>20+</h3>
              <p>Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of students who have transformed their careers at MUST</p>
          <div className="cta-buttons">
            <Link to={applyNowTarget} className="btn btn-primary">
              <i className="fas fa-graduation-cap"></i> Apply Now
            </Link>
            <Link to="/contact" className="btn btn-outline">
              <i className="fas fa-phone"></i> Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home; 