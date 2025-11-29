import React from 'react';
import './Footer.css';
// Example SVG icons (can be replaced with real social links)
const SocialIcon = ({ path, label }) => (
  <span title={label} style={{ display: 'inline-block', margin: '0 0.5rem' }}>
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', color: '#fff' }}>
      <path d={path} />
    </svg>
  </span>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <h2 style={{ fontFamily: 'serif', letterSpacing: '2px' }}>Modeling Agency</h2>
            <p className="footer-desc">Defining the future of style. Connecting talent with opportunity.</p>
            <div className="footer-social">
              <SocialIcon label="Instagram" path="M7 2C4.238 2 2 4.238 2 7v10c0 2.762 2.238 5 5 5h10c2.762 0 5-2.238 5-5V7c0-2.762-2.238-5-5-5H7zm8 3a1 1 0 110 2 1 1 0 010-2zm-5 3a5 5 0 100 10 5 5 0 000-10z" />
              <SocialIcon label="Twitter" path="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4 1.64a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11.64c-2.36 0-4.28 1.92-4.28 4.29 0 .34.04.67.1.99C7.69 5.8 4.07 3.88 1.64 1.16c-.37.64-.58 1.38-.58 2.18 0 1.51.77 2.85 1.94 3.63A4.48 4.48 0 01.96 6.1v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.12 2.9 3.99 2.93A9.06 9.06 0 012 19.54c-.62 0-1.23-.04-1.83-.11A12.94 12.94 0 007.29 21c8.39 0 12.98-6.95 12.98-12.98 0-.2 0-.39-.01-.58A9.18 9.18 0 0023 3z" />
              <SocialIcon label="Facebook" path="M18 2h-3a6 6 0 00-6 6v3H5v4h4v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3V2z" />
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h3>Links</h3>
              <a href="#home">Home</a>
              <a href="#models">Models</a>
              <a href="#cast">Cast</a>
              <a href="#news">News</a>
            </div>
            <div className="footer-column">
              <h3>Services</h3>
              <a href="#book-models">Book Models</a>
              <a href="#book-actors">Book Actors</a>
              <a href="#casting-services">Casting Services</a>
              <a href="#talent-management">Talent Management</a>
              <a href="#grooming-services">Grooming Services</a>
              <a href="#consultation">Consultation and Expert Advice</a>
              <a href="#professionalism">Professionalism and Excellence</a>
            </div>
          </div>
        </div>
        {/* Testimonials removed as requested */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Modeling Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
