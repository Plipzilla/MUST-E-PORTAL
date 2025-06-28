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
    </div>
  );
};

export default HeroBar; 