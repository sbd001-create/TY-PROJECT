import React, { useState } from 'react';
import './ImageSlideshow.css';

const ImageSlideshow = ({ images = [], height = 200 }) => {
  const [index, setIndex] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = () => setIndex(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="is-slideshow">
      <div className="is-frame" style={{ height: `${height}px` }}>
        <img src={images[index]} alt={`slide-${index+1}`} className="is-image" />
        <button className="is-btn is-prev" onClick={prev} aria-label="Previous">❮</button>
        <button className="is-btn is-next" onClick={next} aria-label="Next">❯</button>
      </div>
      <div className="is-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`is-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i+1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow;
