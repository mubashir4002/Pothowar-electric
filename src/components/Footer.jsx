import React from 'react';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './Footer.css';

const Footer = () => {
  const { settings } = useStoreSettings();
  
  const handleWhatsApp = () => {
    const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanWhatsapp}`, '_blank');
  };

  return (
    <footer className="footer">
      <div className="container footer-container">
        <p className="footer-text">© {new Date().getFullYear()} {settings.storeName} — Rawalpindi, Pakistan. All rights reserved.</p>
        <button className="btn-success hover-scale" onClick={handleWhatsApp}>
          <IconBrandWhatsapp size={18} />
          WhatsApp karo
        </button>
      </div>
    </footer>
  );
};

export default Footer;
