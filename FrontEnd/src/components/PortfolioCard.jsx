import React, { useState, useRef, useEffect } from 'react';
import './PortfolioCard.css';

const mockDetails = {
  'Jane Doe': {
    age: 24,
    height: "5'9\"",
    category: 'High Fashion',
    bio: 'Jane is a high fashion model with experience in Paris and Milan shows. She is known for her confidence on the runway and elegant presence.',
    experience: '5 years',
    location: 'New York, USA',
  },
  'John Smith': {
    age: 28,
    height: "6\'1\"",
    category: 'Editorial',
    bio: 'John specializes in editorial shoots for top magazines. His striking features and versatility make him a favorite among creative directors.',
    experience: '7 years',
    location: 'London, UK',
  },
  'Elena Garcia': {
    age: 22,
    height: "5\'7\"",
    category: 'Commercial',
    bio: 'Elena is a commercial model featured in global ad campaigns. She has collaborated with major brands for TV and digital advertisements.',
    experience: '3 years',
    location: 'Madrid, Spain',
  },
  'Michael Brown': {
    age: 26,
    height: "6\'0\"",
    category: 'Fitness',
    bio: 'Michael is a fitness model and certified trainer. He represents major sports brands and frequently appears in fitness magazines.',
    experience: '4 years',
    location: 'Los Angeles, USA',
  },
  'Sophia Lee': {
    age: 25,
    height: "5\'8\"",
    category: 'Runway',
    bio: 'Sophia is a runway model known for her poise and grace. She has walked for several luxury fashion brands in New York and Milan.',
    experience: '6 years',
    location: 'Seoul, South Korea',
  },
  'Ryan Adams': {
    age: 27,
    height: "6\'2\"",
    category: 'Casual Wear',
    bio: 'Ryan is a casual wear model who has appeared in lifestyle campaigns and fashion lookbooks. His friendly style connects well with audiences.',
    experience: '5 years',
    location: 'Toronto, Canada',
  },
  'Olivia Carter': {
    age: 23,
    height: "5\'6\"",
    category: 'Beauty',
    bio: 'Olivia is a beauty and skincare model featured in multiple cosmetic brand promotions. She is admired for her glowing skin and natural charm.',
    experience: '4 years',
    location: 'Sydney, Australia',
  },
  'Daniel White': {
    age: 29,
    height: "6\'1\"",
    category: 'Sports',
    bio: 'Daniel is a sports and athletic model known for his energetic personality and dynamic poses. He works with sportswear and fitness brands globally.',
    experience: '8 years',
    location: 'Chicago, USA',
  },
};

const PortfolioCard = ({ image, name, category }) => {
  const [showDetails, setShowDetails] = useState(false);
  // For touch devices: show the overlay briefly (not persistent)
  const [overlayVisible, setOverlayVisible] = useState(false);
  const overlayTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
    };
  }, []);

  const showOverlayTemporarily = (ms = 1500) => {
    setOverlayVisible(true);
    if (overlayTimeoutRef.current) clearTimeout(overlayTimeoutRef.current);
    overlayTimeoutRef.current = setTimeout(() => {
      setOverlayVisible(false);
      overlayTimeoutRef.current = null;
    }, ms);
  };
  const details = mockDetails[name];
  return (
    <>
      <div className="portfolio-card">
        <div
          className={`card-image-container ${overlayVisible ? 'overlay-visible' : ''}`}
          onTouchStart={() => showOverlayTemporarily(1500)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              showOverlayTemporarily(1500);
            }
          }}
          role="button"
          tabIndex={0}
        >
          <img src={image} alt={name} className="card-image" />
          <div className="card-overlay">
            <div className="overlay-name">{name}</div>
          </div>
        </div>
        <div className="card-content">
          <h3>{name}</h3>
          <p className="card-category">{category}</p>
          <button
            className="view-profile-link"
            style={{background: 'none',   border: 'none',  color: '#1f2937',   fontWeight: 600, fontSize: '1rem',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
            onClick={() => setShowDetails(true)}
          >
            View Profile <span className="arrow">→</span>
          </button>
        </div>
      </div>
      {showDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '18px',
            padding: '3.5rem 4vw',
            minWidth: '60vw',
            maxWidth: '900px',
            width: '80vw',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <button
              onClick={() => setShowDetails(false)}
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                background: 'transparent',
                border: 'none',
                fontSize: '2.5rem',
                color: '#1f2937',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >&times;</button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}>
              <img src={image} alt={name} style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }} />
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h2 style={{ marginBottom: '0.5rem', color: '#1f2937', fontSize: '2.2rem' }}>{name}</h2>
                <p style={{ marginBottom: '0.5rem', fontWeight: 500, fontSize: '1.2rem' }}>{details.category}</p>
                <p style={{ fontSize: '1.1rem' }}><strong>Age:</strong> {details.age}</p>
                <p style={{ fontSize: '1.1rem' }}><strong>Height:</strong> {details.height}</p>
                <p style={{ fontSize: '1.1rem' }}><strong>Location:</strong> {details.location}</p>
                <p style={{ fontSize: '1.1rem' }}><strong>Experience:</strong> {details.experience}</p>
                <p style={{ marginTop: '1.5rem', fontSize: '1.1rem' }}>{details.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
    
  );
};

export default PortfolioCard;