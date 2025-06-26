import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Contact Admissions Office</h1>
            <p>Get in touch with our team for any inquiries about admissions, programs, or technical support</p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-container">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get In Touch</h2>
              <p>We're here to help with your admission journey. Reach out to us through any of these channels:</p>
              
              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-text">
                    <h3>Our Location</h3>
                    <p>Malawi University of Science and Technology<br />
                    P.O. Box 5196, Limbe, Malawi</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="contact-text">
                    <h3>Phone Number</h3>
                    <p>+265 1 478 000<br />
                    +265 1 478 001</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-text">
                    <h3>Email Address</h3>
                    <p>admissions@must.ac.mw<br />
                    support@must.ac.mw</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-text">
                    <h3>Working Hours</h3>
                    <p>Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-info-circle"></i>
                  </div>
                  <div className="contact-text">
                    <h3>Admission Hours</h3>
                    <p>For in-person inquiries:<br />
                    Tuesday & Thursday: 9:00 AM - 3:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form">
              <div className="form-card">
                <h3>Send us a Message</h3>
                <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="Application Inquiry">Application Inquiry</option>
                      <option value="Document Submission">Document Submission</option>
                      <option value="Payment Issues">Payment Issues</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Program Information">Program Information</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your inquiry in detail..."
                      rows={5}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-paper-plane"></i>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <h3>Need Help?</h3>
              <p>Check our comprehensive FAQ section for quick answers to common questions.</p>
              <Link to="/faq" className="btn btn-outline">View FAQs</Link>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3>Application Guide</h3>
              <p>Step-by-step guide to complete your application process successfully.</p>
              <Link to="/guide" className="btn btn-outline">Read Guide</Link>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Student Support</h3>
              <p>Connect with our student support team for personalized assistance.</p>
              <Link to="/support" className="btn btn-outline">Get Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 