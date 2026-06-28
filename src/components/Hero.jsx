import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <h1 className="hero-title">Pothowar Electric: The Region's Premier Electrical Distributor</h1>
        <p className="hero-sub">Empowering infrastructure with authentic, industry-grade electrical solutions. Your trusted supply partner in Rawalpindi and Islamabad since 2005.</p>
        <div className="hero-btns">
          <Link to="/products" className="btn-primary hover-scale">View Full Catalog</Link>
          <Link to="/b2b" className="btn-outline hover-scale" style={{ borderColor: 'white', color: 'white' }}>Request Wholesale Quote</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
