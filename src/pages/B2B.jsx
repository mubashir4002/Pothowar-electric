import React from 'react';
import B2BSection from '../components/B2BSection';

const B2B = () => {
  return (
    <>
      <div style={{ paddingTop: '2rem' }}></div>
      <B2BSection />
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Why partner with us?</h3>
        <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>
          <li>Special contractor pricing on all bulk items</li>
          <li>Priority delivery in Rawalpindi & Islamabad</li>
          <li>Genuine products with warranty</li>
          <li>Dedicated account manager for large projects</li>
        </ul>
      </div>
    </>
  );
};

export default B2B;
