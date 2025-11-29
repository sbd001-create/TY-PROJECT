import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-hero">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you! Whether you're a model, client, or just curious, reach out and our team will get back to you soon.</p>
      </div>
      <div className="contact-content">
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="you@email.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" placeholder="Type your message..." rows="5" required></textarea>
          </div>
          <button type="submit" className="contact-btn">Send Message</button>
        </form>
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p><strong>Email:</strong> info@modelingagency.com</p>
          <p><strong>Phone:</strong> +1 234 567 8901</p>
          <p><strong>Address:</strong> 123 Fashion Ave, New York, NY</p>
          <div className="contact-social">
            <a href="#" title="Instagram"><img src="/src/assets/react.svg" alt="Instagram" /></a>
            <a href="#" title="Twitter"><img src="/src/assets/react.svg" alt="Twitter" /></a>
            <a href="#" title="Facebook"><img src="/src/assets/react.svg" alt="Facebook" /></a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
