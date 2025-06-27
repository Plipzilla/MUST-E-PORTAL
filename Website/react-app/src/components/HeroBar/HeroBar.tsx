import React, { useState, useEffect } from 'react';
import './HeroBar.css';

interface HeroBarProps {
  title: string;
  subtitle?: string;
  images?: string[];
}

const HeroBar: React.FC<HeroBarProps> = ({ title, subtitle, images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length < 2) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  const goToSlide = (idx: number) => setCurrent(idx);

  return (
    <div
      className="hero-bar"
      style={images && images.length > 0 ? { backgroundImage: `url(${images[current]})` } : {}}
    >
      {images && images.length > 0 && <div className="hero-bar-overlay" />}
      <div className="hero-bar-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {images && images.length > 1 && (
        <div className="hero-bar-dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`hero-bar-dot${idx === current ? ' active' : ''}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBar; 