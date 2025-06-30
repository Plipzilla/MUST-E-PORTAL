import React from 'react';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-main">
      <div className="footer-col footer-brand">
        <img src="/logo.png" alt="MUST Logo" className="footer-logo" />
        <div className="footer-motto">Where Excellence Reigns</div>
        <div className="footer-address">P.O. Box 5196, Limbe, Malawi</div>
        <div className="footer-contact"><i className="fas fa-phone"></i> +265 111 678 000</div>
        <div className="footer-contact"><i className="fas fa-envelope"></i> registrar@must.ac.mw</div>
        <div className="footer-social">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="X"><i className="fab fa-x-twitter"></i></a>
          <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
      <div className="footer-col">
        <div className="footer-heading">Students</div>
        <ul>
          <li>Health</li>
          <li>Social Support</li>
          <li>Religious Life</li>
          <li>Accommodation</li>
          <li><strong>Request for English proficiency evidence</strong></li>
          <li><strong>Apply for admission</strong></li>
        </ul>
      </div>
      <div className="footer-col">
        <div className="footer-heading">About</div>
        <ul>
          <li>Events</li>
          <li>Facilities</li>
          <li>Projects</li>
          <li>Directorates</li>
          <li>Work with Us</li>
          <li>News and Updates</li>
          <li>Research & Outreach</li>
        </ul>
      </div>
      <div className="footer-col">
        <div className="footer-heading">Quick Links</div>
        <ul>
          <li>ODel</li>
          <li>SARIS</li>
          <li>Journal</li>
          <li>E-learning</li>
          <li>Pay Online</li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2025 MUST. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer; 