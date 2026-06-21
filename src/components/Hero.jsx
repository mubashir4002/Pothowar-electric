import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <h1 className="hero-title">Rawalpindi ka trusted electrical supplier</h1>
        <p className="hero-sub">LED lights, fans, solar products, DB boxes aur bahut kuch</p>
        <div className="hero-btns">
          <Link to="/products" className="btn-primary hover-scale">Shop Now</Link>
          <Link to="/b2b" className="btn-outline hover-scale" style={{ borderColor: 'white', color: 'white' }}>Bulk Inquiry</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
