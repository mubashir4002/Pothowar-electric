import React from 'react';
import { Link } from 'react-router-dom';
import './B2BSection.css';

const B2BSection = () => {
  return (
    <section className="b2b-section">
      <div className="container b2b-container">
        <h2 className="b2b-title">Corporate & Wholesale Partnerships</h2>
        <p className="b2b-sub">Unlock exclusive wholesale pricing and dedicated account management tailored for builders, electricians, and corporate contractors.</p>
        <Link to="/b2b" className="btn-primary hover-scale b2b-btn">
          Request Wholesale Quote
        </Link>
      </div>
    </section>
  );
};

export default B2BSection;
