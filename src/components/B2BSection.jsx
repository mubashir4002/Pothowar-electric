import React from 'react';
import './B2BSection.css';

const B2BSection = () => {
  return (
    <section className="b2b-section">
      <div className="container b2b-container">
        <h2 className="b2b-title">Contractor & Wholesale Inquiries</h2>
        <p className="b2b-sub">Bulk orders pe special pricing milti hai — electricians, builders, contractors ke liye</p>
        <button className="btn-primary hover-scale b2b-btn">
          Send Bulk Inquiry
        </button>
      </div>
    </section>
  );
};

export default B2BSection;
