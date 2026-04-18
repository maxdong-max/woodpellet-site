'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroSection({ hero: staticHero }) {
  const [carousel, setCarousel] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch('/api/admin/carousel')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCarousel(data);
        }
      })
      .catch(err => console.error('Failed to load carousel:', err));
  }, []);

  const hero = carousel && carousel.length > 0 ? {
    ...staticHero,
    backgroundImage: carousel[currentSlide]?.image || staticHero.backgroundImage,
    title: carousel[currentSlide]?.title || staticHero.title,
    cta: carousel[currentSlide]?.link ? [
      { text: 'Contact Us Now', href: carousel[currentSlide].link },
      { text: 'Become Our Dealer', href: '/become-our-dealer' }
    ] : staticHero.cta
  } : staticHero;

  useEffect(() => {
    if (carousel && carousel.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % carousel.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carousel]);

  return (
    <section 
      className="hero-section"
      style={hero.backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(26,26,46,0.92), rgba(0,102,204,0.88)), url(${hero.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="container">
        <div className="hero-content">
          <span className="hero-badge">🚜 Global Leading Manufacturer Since 1960</span>
          <h1>{hero.title}</h1>
          <p>{hero.subtitle}</p>
          <div className="hero-stats">
            {hero.stats.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <span className="stat-number">{idx === 0 ? '62+' : idx === 1 ? '1000+' : '50+'}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="hero-cta">
            <a href={hero.cta[0].href} className="btn btn-primary">{hero.cta[0].text}</a>
            <Link href={hero.cta[1].href} className="btn btn-secondary">{hero.cta[1].text}</Link>
          </div>
        </div>
      </div>
      
      {/* Carousel Dots */}
      {carousel && carousel.length > 1 && (
        <div className="carousel-dots">
          {carousel.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}