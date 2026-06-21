import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconTrophy,
  IconUsers,
  IconBolt,
  IconMapPin,
  IconShieldCheck,
  IconHeartHandshake,
  IconCurrencyDollar,
  IconBuildingStore,
  IconBrandWhatsapp,
  IconShoppingBag
} from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import './About.css';

const About = () => {
  const handleWhatsApp = () => {
    const message = `Hello Pothowar Electric, I am reaching out from your website's About page.`;
    window.open(`https://wa.me/923348700655?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Our History & Trust | Pothowar Electric</title>
        <meta name="description" content="Learn about Pothowar Electric, Rawalpindi's most trusted family-owned electrical supplier. Over 15 years of experience delivering genuine products and honest pricing." />
      </Helmet>
      
      {/* ─── Hero Section ─── */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">
            Rawalpindi's Most Trusted Electrical Partner — <span>For Over 15 Years</span>
          </h1>
          <p className="about-hero-subtitle">
            Pothowar Electric and Pothowar Traders — a family legacy that has been powering homes,
            businesses, and projects across Rawalpindi for over a decade.
          </p>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="about-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <IconTrophy size={36} className="stat-icon" />
              <div className="stat-value">15+</div>
              <div className="stat-label">Years of Experience</div>
            </div>
            <div className="stat-card">
              <IconUsers size={36} className="stat-icon" />
              <div className="stat-value">5000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <IconBolt size={36} className="stat-icon" />
              <div className="stat-value">500+</div>
              <div className="stat-label">Products Available</div>
            </div>
            <div className="stat-card">
              <IconMapPin size={36} className="stat-icon" />
              <div className="stat-value">2</div>
              <div className="stat-label">Shop Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Story Section ─── */}
      <section className="about-story">
        <div className="container story-container">
          <h2 className="section-title">Our Story</h2>
          <div className="story-content">
            <p>
              Pothowar Electric was founded with a simple mission — to give the people of Rawalpindi
              access to genuine electrical products, all under one roof, without the hassle. Over 15 years ago,
              our family started this journey, and today the Pothowar name has become a mark of trust in the region.
            </p>
            <p>
              Years of experience taught us that selling products is not enough — you have to earn the
              customer's trust. That is why we have always prioritized genuine products, honest pricing,
              and real after-sale support. It is what brings our customers back, time and time again.
            </p>
            <p>
              Today we operate two shops — <strong>Pothowar Electric</strong> and <strong>Pothowar Traders</strong> — covering
              everything from LED lighting and fans to solar systems, DB boxes, and all kinds of electrical
              accessories. And now we are online too, so you can reach us from the comfort of your home.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us Section ─── */}
      <section className="about-features">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <IconShieldCheck size={32} />
              </div>
              <h3 className="feature-title">Genuine Products</h3>
              <p className="feature-desc">
                We stock only authentic, branded products. No duplicates, no shortcuts — that is our promise and our identity.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <IconHeartHandshake size={32} />
              </div>
              <h3 className="feature-title">Customer First</h3>
              <p className="feature-desc">
                Every customer is like family to us. Whether it is a small purchase or a large project, you get our full attention and care.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">
                <IconCurrencyDollar size={32} />
              </div>
              <h3 className="feature-title">Competitive Pricing</h3>
              <p className="feature-desc">
                Fair rates for both retail and wholesale. Special bulk pricing available for contractors, electricians, and builders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our Two Shops Section ─── */}
      <section className="about-shops">
        <div className="container">
          <h2 className="section-title">Our Two Shops</h2>
          <div className="shops-grid">
            <div className="shop-card">
              <h3 className="shop-title">
                <IconBuildingStore size={28} /> Pothowar Electric
              </h3>
              <p className="shop-desc">
                LED bulbs, ceiling lights, tube lights, bulb holders, capacitors, shutters,
                distribution boxes (DB), changeover switches, and all electrical accessories.
              </p>
            </div>
            <div className="shop-card">
              <h3 className="shop-title">
                <IconBuildingStore size={28} /> Pothowar Traders
              </h3>
              <p className="shop-desc">
                Ceiling fans, bracket fans, exhaust fans, solar panels, solar inverters,
                batteries, and complete solar solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="about-cta">
        <div className="container">
          <h2 className="about-cta-title">Let's Connect — Online or In-Store!</h2>
          <p className="about-cta-desc">
            Whether you have a question, need a product, or want to place a bulk order — we are available on
            WhatsApp or you can visit us directly at our shop in Rawalpindi.
          </p>
          <div className="about-cta-btns">
            <button className="btn-success hover-scale" onClick={handleWhatsApp} style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
              <IconBrandWhatsapp size={20} />
              WhatsApp Us
            </button>
            <Link to="/products" className="btn-outline hover-scale" style={{ borderColor: 'white', color: 'white', padding: '0.8rem 1.5rem', fontSize: '1rem' }}>
              <IconShoppingBag size={20} style={{ marginRight: '0.5rem', verticalAlign: '-4px' }} />
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
