import React from 'react';
import PortfolioCard from './PortfolioCard';
import './Portfolio.css';
import janeDoe from '../assets/jane-doe.jpg';
import johnSmith from '../assets/john-smith.jpg';
import elenaGarcia from '../assets/elena-garcia.jpg';
import michaelBrown from '../assets/michael-brown.jpg';


const models = [
  { name: 'Jane Doe', category: 'High Fashion', image: janeDoe },
  { name: 'John Smith', category: 'Editorial', image: johnSmith },
  { name: 'Elena Garcia', category: 'Commercial', image: elenaGarcia },
  { name: 'Michael Brown', category: 'Fitness', image: michaelBrown },
  { name: 'Sophia Lee', category: 'Runway', image: janeDoe },
  { name: 'Ryan Adams', category: 'Casual Wear', image: johnSmith },
  { name: 'Olivia Carter', category: 'Beauty', image: elenaGarcia },
  { name: 'Daniel White', category: 'Sports', image: michaelBrown },
];


const Portfolio = () => {
  return (
    <section className="portfolio-section">
      <h2 className="portfolio-title">Our Portfolio</h2>
      <div className="portfolio-grid">
        {models.map((model, index) => (
          <PortfolioCard
            key={index}
            image={model.image}
            name={model.name}
            // category={model.category}
          />
        ))}
      </div>
    </section>
  );
};

export default Portfolio;