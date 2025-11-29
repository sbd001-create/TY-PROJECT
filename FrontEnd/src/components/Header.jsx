import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content" id='home'>
        <h1>Defining the Future of Style</h1>
        <p>Discover the faces that define the future of modeling</p>
        <button
          className="portfolio-button"
          onClick={() => {
            const section = document.getElementById('portfolio');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Explore Our Portfolio
        </button>
      </div>
    </header>
  );
};

export default Header;