import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconBolt,
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBrandFacebook,
  IconClock,
} from '@tabler/icons-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './Footer.css';

const Footer = () => {
  const { settings } = useStoreSettings();

  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${cleanWhatsapp}`, '_blank');
  };

  return (
    <>
      <footer className="footer">
        {/* ── Main Footer ─── */}
        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">

              {/* Column 1: Brand */}
              <div>
                <div className="footer-brand-name">
                  <IconBolt size={22} /> {settings.storeName}
                </div>
                <p className="footer-brand-desc">
                  Your trusted wholesale electrical supplier in Rawalpindi. Serving contractors, builders, and businesses with genuine products since 2014.
                </p>
                <div className="footer-social">
                  <button className="footer-social-btn" onClick={handleWhatsApp} aria-label="WhatsApp">
                    <IconBrandWhatsapp size={18} />
                  </button>
                  <a
                    className="footer-social-btn"
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <IconBrandFacebook size={18} />
                  </a>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h4 className="footer-col-title">Quick Links</h4>
                <ul className="footer-links">
                  <li><Link to="/products">Products Catalog</Link></li>
                  <li><Link to="/b2b">Bulk / B2B Orders</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </div>

              {/* Column 3: Business Hours */}
              <div>
                <h4 className="footer-col-title">Business Hours</h4>
                <ul className="footer-links">
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <IconClock size={14} /> Mon – Thu: 9 AM – 8 PM
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <IconClock size={14} /> Sat – Sun: 9 AM – 8 PM
                  </li>
                  <li style={{ color: '#ef4444', fontWeight: 600 }}>
                    Friday: Closed
                  </li>
                </ul>
              </div>

              {/* Column 4: Contact */}
              <div>
                <h4 className="footer-col-title">Contact Info</h4>
                <div className="footer-contact-list">
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon"><IconPhone size={16} /></div>
                    <div>
                      <a href={`tel:${settings.phone}`}>{settings.phone}</a>
                    </div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon"><IconBrandWhatsapp size={16} /></div>
                    <div>
                      <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer">
                        {settings.whatsapp}
                      </a>
                    </div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon"><IconMail size={16} /></div>
                    <div>
                      <a href={`mailto:${settings.email}`}>{settings.email}</a>
                    </div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon"><IconMapPin size={16} /></div>
                    <div>{settings.address}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Bottom Bar ─── */}
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-inner">
              <span className="footer-copyright">
                © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
              </span>
              <span className="footer-tagline">
                Rawalpindi, Pakistan — Trusted since 2014
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp Button ─── */}
      <button className="whatsapp-float" onClick={handleWhatsApp} aria-label="Chat on WhatsApp">
        <IconBrandWhatsapp size={24} />
        <span className="whatsapp-float-text">Chat with us</span>
      </button>
    </>
  );
};

export default Footer;
