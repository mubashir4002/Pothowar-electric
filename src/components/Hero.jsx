import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <h1 className="hero-title">Rawalpindi ka trusted electrical supplier</h1>
        <p className="hero-sub">LED lights, fans, solar products, DB boxes aur bahut kuch</p>
        <div className="hero-btns">
          <button className="btn-primary hover-scale">Shop Now</button>
          <button className="btn-outline hover-scale" style={{ borderColor: 'white', color: 'white' }}>Bulk Inquiry</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
