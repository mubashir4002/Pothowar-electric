import React from 'react';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <p className="footer-text">© {new Date().getFullYear()} Pothowar Electric — Rawalpindi, Pakistan. All rights reserved.</p>
        <button className="btn-success hover-scale">
          <IconBrandWhatsapp size={18} />
          WhatsApp karo
        </button>
      </div>
    </footer>
  );
};

export default Footer;
