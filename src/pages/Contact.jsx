import React, { useState } from 'react';
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconBrandWhatsapp,
  IconSend
} from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      alert("Please enter at least your name and message.");
      return;
    }

    const waMessage = `*Contact Form Submission*\n\n` +
      `*Name:* ${form.name}\n` +
      `*Phone:* ${form.phone || 'N/A'}\n` +
      `*Email:* ${form.email || 'N/A'}\n` +
      `*Subject:* ${form.subject || 'General Inquiry'}\n` +
      `*Message:* ${form.message}`;

    window.open(`https://wa.me/923348700655?text=${encodeURIComponent(waMessage)}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Contact Us & Locations | Pothowar Electric</title>
        <meta name="description" content="Get in touch with Pothowar Electric. Visit our shops in Rawalpindi at Commetti Chowk or contact us via WhatsApp for instant pricing and stock inquiries." />
      </Helmet>

      {/* ─── Hero Section ─── */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Contact Us</h1>
          <p className="contact-hero-subtitle">
            We are here to help with your electrical needs. Reach out to us online or visit our stores in Rawalpindi.
          </p>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">

            {/* Left: Contact Info */}
            <div className="contact-info-wrapper">

              <div className="info-section">
                <h2 className="info-block-header">Get In Touch</h2>

                <div className="info-item">
                  <div className="info-icon"><IconPhone size={24} /></div>
                  <div className="info-content">
                    <h4>Phone & WhatsApp</h4>
                    <p>051-5530360 (Landline)</p>
                    <p>+92 3348700655 (WhatsApp)</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon"><IconMail size={24} /></div>
                  <div className="info-content">
                    <h4>Email Address</h4>
                    <p><a href="mailto:info@pothowarelectric.pk">info@pothowarelectric.pk</a></p>
                    <p><a href="mailto:sales@pothowarelectric.pk">sales@pothowarelectric.pk</a></p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon"><IconClock size={24} /></div>
                  <div className="info-content">
                    <h4>Business Hours</h4>
                    <p>Monday - Thursday: 9:00 AM - 8:00 PM</p>
                    <p>Friday: Closed</p>
                    <p>Saturday - Sunday: 9:00 AM - 8:00 PM</p>


                  </div>
                </div>
              </div>

              <div className="info-section" style={{ marginTop: '1rem' }}>
                <h2 className="info-block-header">Our Locations</h2>

                <div className="info-item">
                  <div className="info-icon"><IconMapPin size={24} /></div>
                  <div className="info-content">
                    <h4>Pothowar Traders</h4>
                    <p>Iqbal Road Cometti Chowk Near Shirin Bakery, Rawalpindi, Pakistan</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Contact Form */}
            <div>
              <div className="contact-form-card">
                <h3 className="contact-form-title">Send a Message</h3>
                <p className="contact-form-subtitle">
                  Fill out the form below and we will get back to you as soon as possible via WhatsApp.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name <span>*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="0334-8700655"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message <span>*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-control"
                      placeholder="Your message here..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary submit-btn">
                    <IconBrandWhatsapp size={20} />
                    Send via WhatsApp
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Google Maps Section ─── */}
      <section className="map-section">
        <div className="container">
          <div className="map-container">
            <iframe
              title="Pothowar Electric Location"
              className="map-iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106312.3592881261!2d72.96445580666068!3d33.603126937666244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df948974419acb%3A0x984357e1632d30f!2sSaddar%2C%20Rawalpindi%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
