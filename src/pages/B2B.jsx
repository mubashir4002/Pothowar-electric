import React, { useState } from 'react';
import {
  IconBuildingFactory2,
  IconTruckDelivery,
  IconShieldCheck,
  IconCurrencyDollar,
  IconHeadset,
  IconClipboardList,
  IconBrandWhatsapp,
  IconPhone,
  IconMapPin,
  IconMail,
  IconCircleCheck,
  IconUsers,
  IconPackage,
} from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useStoreSettings } from '../context/StoreSettingsContext';
import './B2B.css';

const BENEFITS = [
  {
    icon: <IconCurrencyDollar size={26} />,
    title: 'Bulk Discount Pricing',
    desc: 'Special contractor rates on all orders. The more you order, the more you save — up to 30% off retail price.',
  },
  {
    icon: <IconTruckDelivery size={26} />,
    title: 'Priority Delivery',
    desc: 'Same-day or next-day delivery within Rawalpindi & Islamabad for bulk orders. Free delivery on orders above Rs. 25,000.',
  },
  {
    icon: <IconShieldCheck size={26} />,
    title: 'Genuine Products, Warranty',
    desc: 'Only authentic, brand-certified electrical products. All items come with manufacturer warranty and after-sale support.',
  },
  {
    icon: <IconHeadset size={26} />,
    title: 'Dedicated Account Manager',
    desc: 'Get a personal account manager for large projects who handles your quotes, orders, and delivery coordination.',
  },
  {
    icon: <IconClipboardList size={26} />,
    title: 'Credit Terms Available',
    desc: 'Flexible payment terms for registered contractors and builders. Buy now, pay later options on approved accounts.',
  },
  {
    icon: <IconBuildingFactory2 size={26} />,
    title: 'Project-Based Sourcing',
    desc: 'We source specific items for your project requirements even if not in stock — solar systems, DB setups, and more.',
  },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Submit Inquiry', desc: 'Fill in the form with your project details and product requirements.' },
  { num: '02', title: 'Get Quotation', desc: 'We prepare a custom quote within 2-4 hours and send it via WhatsApp.' },
  { num: '03', title: 'Confirm Order', desc: 'Review the quote, confirm quantities and delivery address.' },
  { num: '04', title: 'Fast Delivery', desc: 'Your order is packed and delivered with priority handling.' },
];

const CATEGORIES = ['LED Lights', 'Fans', 'Solar Panels', 'DB Boxes', 'Wiring & Cable', 'Switches & Sockets', 'Other'];

const B2B = () => {
  const { settings } = useStoreSettings();
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    quantity: '',
    budget: '',
    message: '',
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9+\-\s]{10,14}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid phone number';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (selectedCategories.length === 0) newErrors.categories = 'Please select at least one product category';
    return newErrors;
  };

  const handleWhatsApp = () => {
    const cats = selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Not specified';
    const message =
      `*Bulk/B2B Inquiry — ${settings.storeName}*\n\n` +
      `*Name:* ${form.name}\n` +
      `*Company:* ${form.company || 'N/A'}\n` +
      `*Phone:* ${form.phone}\n` +
      `*Email:* ${form.email || 'N/A'}\n` +
      `*City:* ${form.city}\n` +
      `*Product Categories:* ${cats}\n` +
      `*Estimated Quantity:* ${form.quantity || 'N/A'}\n` +
      `*Estimated Budget:* ${form.budget || 'N/A'}\n` +
      `*Additional Details:* ${form.message || 'None'}\n\n` +
      `Please provide a bulk quotation at your earliest.`;
    const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          city: form.city,
          categories: selectedCategories.join(', '),
          quantity: form.quantity,
          budget: form.budget,
          message: form.message
        }]);

      if (error) throw error;

      setSubmitted(true);
      handleWhatsApp();
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      alert('Failed to submit inquiry to the database. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ name: '', company: '', phone: '', email: '', city: '', quantity: '', budget: '', message: '' });
    setSelectedCategories([]);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <>
      <Helmet>
        <title>Wholesale & Bulk Orders | {settings.storeName}</title>
        <meta name="description" content={`Partner with ${settings.storeName} for your construction or retail business. We offer special B2B pricing, dedicated support, and reliable supply lines.`} />
      </Helmet>

      {/* ─── Hero ─── */}
      <section className="b2b-hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="b2b-hero-badge">
            <IconUsers size={14} /> For Contractors & Businesses
          </div>
          <h1 className="b2b-hero-title">
            Wholesale Electrical Supplies for <span>Professionals</span>
          </h1>
          <p className="b2b-hero-subtitle">
            Special pricing, guaranteed stock, and priority service for electricians, builders,
            developers, and contractors in Rawalpindi & Islamabad.
          </p>
          <div className="b2b-hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">500+</div>
              <div className="hero-stat-label">B2B Clients Served</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">30%</div>
              <div className="hero-stat-label">Max Bulk Discount</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">4hrs</div>
              <div className="hero-stat-label">Quote Turnaround</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">10+</div>
              <div className="hero-stat-label">Years in Business</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="b2b-benefits-section">
        <div className="container">
          <h2 className="section-title">Why Partner With Us?</h2>
          <div className="benefits-grid">
            {BENEFITS.map((b, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-icon-wrapper">{b.icon}</div>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Process Steps ─── */}
      <section className="b2b-process-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="process-steps">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="process-step">
                <div className="step-number">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Inquiry Form ─── */}
      <section className="b2b-form-section" id="inquiry-form">
        <div className="container">
          <div className="form-section-inner">

            {/* Left Panel */}
            <div className="form-info-panel">
              <span className="form-info-label">
                <IconPackage size={14} /> Get a Quote
              </span>
              <h2 className="form-info-heading">Request a Wholesale Quote</h2>
              <p className="form-info-para">
                Please provide your project details below. We'll review your requirements and send you a custom wholesale quotation shortly.
              </p>
              <div className="form-contact-list">
                <div className="form-contact-item">
                  <div className="form-contact-icon"><IconBrandWhatsapp size={20} /></div>
                  <div className="form-contact-text">
                    <strong>WhatsApp</strong>
                    {settings.whatsapp}
                  </div>
                </div>
                <div className="form-contact-item">
                  <div className="form-contact-icon"><IconPhone size={20} /></div>
                  <div className="form-contact-text">
                    <strong>Phone</strong>
                    {settings.phone}
                  </div>
                </div>
                <div className="form-contact-item">
                  <div className="form-contact-icon"><IconMapPin size={20} /></div>
                  <div className="form-contact-text">
                    <strong>Location</strong>
                    {settings.address}
                  </div>
                </div>
                <div className="form-contact-item">
                  <div className="form-contact-icon"><IconMail size={20} /></div>
                  <div className="form-contact-text">
                    <strong>Email</strong>
                    {settings.email}
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {['Verified & Genuine Products Only', 'No Hidden Charges', 'Delivery Across Punjab'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    <IconCircleCheck size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="inquiry-form-card">
              <h3 className="inquiry-form-title">Wholesale Quotation Form</h3>
              <p className="inquiry-form-sub">Fields marked with <span style={{ color: '#ef4444' }}>*</span> are required.</p>

              {submitted && (
                <div className="form-success-banner visible">
                  <IconCircleCheck size={20} />
                  Inquiry sent! We'll contact you shortly via WhatsApp.
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid form-grid-2">

                  {/* Name */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="b2b-name">Full Name <span>*</span></label>
                    <input
                      id="b2b-name"
                      className="form-input"
                      type="text"
                      name="name"
                      placeholder="e.g. Ahmad Raza"
                      value={form.name}
                      onChange={handleChange}
                      style={errors.name ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.name && <span style={{ fontSize: '0.78rem', color: '#ef4444' }}>{errors.name}</span>}
                  </div>

                  {/* Company */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="b2b-company">Company / Business Name</label>
                    <input
                      id="b2b-company"
                      className="form-input"
                      type="text"
                      name="company"
                      placeholder="e.g. Raza Builders"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="b2b-phone">Phone / WhatsApp <span>*</span></label>
                    <input
                      id="b2b-phone"
                      className="form-input"
                      type="tel"
                      name="phone"
                      placeholder="e.g. 0300-1234567"
                      value={form.phone}
                      onChange={handleChange}
                      style={errors.phone ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.phone && <span style={{ fontSize: '0.78rem', color: '#ef4444' }}>{errors.phone}</span>}
                  </div>

                  {/* Email */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="b2b-email">Email Address</label>
                    <input
                      id="b2b-email"
                      className="form-input"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* City */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="b2b-city">City / Area <span>*</span></label>
                    <input
                      id="b2b-city"
                      className="form-input"
                      type="text"
                      name="city"
                      placeholder="e.g. Rawalpindi, Islamabad"
                      value={form.city}
                      onChange={handleChange}
                      style={errors.city ? { borderColor: '#ef4444' } : {}}
                    />
                    {errors.city && <span style={{ fontSize: '0.78rem', color: '#ef4444' }}>{errors.city}</span>}
                  </div>

                  {/* Quantity */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="b2b-quantity">Estimated Quantity</label>
                    <input
                      id="b2b-quantity"
                      className="form-input"
                      type="text"
                      name="quantity"
                      placeholder="e.g. 50 bulbs, 10 fans"
                      value={form.quantity}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Budget */}
                  <div className="form-field">
                    <label className="form-label" htmlFor="b2b-budget">Estimated Budget (Rs.)</label>
                    <select
                      id="b2b-budget"
                      className="form-select"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                    >
                      <option value="">Select budget range</option>
                      <option value="Under Rs. 50,000">Under Rs. 50,000</option>
                      <option value="Rs. 50,000 – 1,00,000">Rs. 50,000 – 1,00,000</option>
                      <option value="Rs. 1,00,000 – 5,00,000">Rs. 1,00,000 – 5,00,000</option>
                      <option value="Rs. 5,00,000+">Rs. 5,00,000+</option>
                    </select>
                  </div>

                  {/* Product Categories — full width */}
                  <div className="form-field full-width">
                    <label className="form-label">Product Categories Needed <span>*</span></label>
                    <div className="category-chips">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`cat-chip ${selectedCategories.includes(cat) ? 'selected' : ''}`}
                          onClick={() => toggleCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    {errors.categories && <span style={{ fontSize: '0.78rem', color: '#ef4444' }}>{errors.categories}</span>}
                  </div>

                  {/* Message — full width */}
                  <div className="form-field full-width">
                    <label className="form-label" htmlFor="b2b-message">Additional Details / Special Requirements</label>
                    <textarea
                      id="b2b-message"
                      className="form-textarea"
                      name="message"
                      placeholder="Describe your project, site location, delivery timeline, or any special product specifications..."
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                {/* Submit Buttons */}
                <div className="form-submit-row" style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-primary submit-btn-primary" disabled={isSubmitting}>
                    <IconBrandWhatsapp size={20} />
                    {isSubmitting ? 'Sending...' : 'Send Inquiry via WhatsApp'}
                  </button>
                  {submitted && (
                    <button type="button" className="btn-outline" onClick={handleReset} style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}>
                      Submit Another Inquiry
                    </button>
                  )}
                </div>

                <p style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
                  By submitting this form, you'll be redirected to WhatsApp with your inquiry pre-filled.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default B2B;
