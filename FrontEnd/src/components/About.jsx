import React from 'react';
import './About.css';
import teamImage from '../assets/team-image.jpg'; // You'll need to save the team image from the prompt to your assets folder.

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <div className="about-text">
          <h2>About Our Agency</h2>
          <p>
            TY-PROJECT is a premier modeling agency dedicated to nurturing talent and connecting our models with top-tier brands. We believe in authenticity, professionalism, and building lasting careers. Our commitment is to provide a seamless experience for both our models and clients, ensuring every project is a success.
          </p>
        </div>
        <div className="about-image">
          <img src={teamImage} alt="Our Agency Team" />
        </div>
      </div>
    </section>
  );
};

export default About;