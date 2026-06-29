import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  IconBolt, 
  IconSearch, 
  IconShoppingCart, 
  IconX, 
  IconBrandWhatsapp, 
  IconMenu2,
  IconPhone,
  IconMail,
  IconChevronDown,
  IconUser,
  IconMoon,
  IconSun
} from '@tabler/icons-react';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useProduct } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const {
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  } = useCart();
  
  const { settings } = useStoreSettings();
  const { isDarkMode, toggleTheme } = useTheme();
  const { categories } = useProduct();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleCheckout = () => {
    const itemsText = cart
      .map((item) => {
        let label = item.name;
        if (item.selectedVariant) {
          label += ` - ${item.selectedVariant.label}`;
          if (item.selectedVariant.color) label += ` (${item.selectedVariant.color})`;
        }
        return `- ${label} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}`;
      })
      .join('\n');
    const message = `Hello ${settings.storeName}, I would like to place an order for the following items:\n\n${itemsText}\n\n*Total Amount:* Rs. ${cartTotal.toLocaleString()}\n\nPlease confirm availability and delivery terms.`;
    const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encoded}`, '_blank');
  };

  return (
    <>
      {/* --- Top Bar --- */}
      <div className="top-bar">
        <div className="container top-bar-container">
          <div className="top-bar-contact">
            <div className="top-bar-item">
              <IconPhone size={14} />
              <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            </div>
            <div className="top-bar-item">
              <IconMail size={14} />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </div>
          </div>
          <div className="top-bar-links">
            <Link to="/about" className="top-bar-item">About Us</Link>
            <Link to="/contact" className="top-bar-item">Contact</Link>
            <Link to="/admin" className="top-bar-item" style={{ color: 'var(--color-brand-accent)' }}>
              <IconUser size={14} /> Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* --- Main Navbar --- */}
      <nav className="navbar">
        <div className="container nav-container">
          
          {/* Logo */}
          <Link to="/" className="nav-logo hover-scale">
            <IconBolt size={26} className="logo-icon" />
            <span>{settings.storeName}</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="nav-search-container">
            <form className="nav-search-form" onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                className="nav-search-input" 
                placeholder="Search products by name, brand..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="nav-search-btn" aria-label="Search">
                <IconSearch size={18} />
              </button>
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="nav-actions">
            <div className="nav-links-desktop">
              
              {/* Category Dropdown */}
              <div className="nav-dropdown-wrapper">
                <Link to="/products" className="nav-link">
                  Products <IconChevronDown size={16} style={{ marginTop: '2px' }} />
                </Link>
                <div className="nav-dropdown-menu">
                  <Link to="/products" className="nav-dropdown-item">All Products</Link>
                  {categories.map(cat => (
                    <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="nav-dropdown-item">
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* CTA Button */}
              <Link to="/b2b" className="nav-cta-btn hover-scale">
                Request Bulk Quote
              </Link>
            </div>

            {/* Cart & Theme & Mobile Toggle */}
            <button className="icon-btn hover-scale" aria-label="Toggle Theme" onClick={toggleTheme} style={{ marginRight: '0.5rem', color: 'var(--color-brand-primary)' }}>
              {isDarkMode ? <IconSun size={24} /> : <IconMoon size={24} />}
            </button>
            <button className="icon-btn hover-scale cart-btn" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
              <IconShoppingCart size={24} stroke={1.5} style={{ color: 'inherit' }} />
              <span className="cart-badge">{cartCount}</span>
            </button>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <IconMenu2 size={28} />
            </button>
          </div>

        </div>
      </nav>

      {/* --- Mobile Menu Panel --- */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-nav-panel ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <IconBolt size={24} className="logo-icon" />
            <span style={{ color: 'var(--color-brand-primary)' }}>{settings.storeName}</span>
          </Link>
          <button className="icon-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <IconX size={28} />
          </button>
        </div>
        
        <div className="mobile-nav-content">
          <form className="mobile-search" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              className="nav-search-input" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="nav-search-btn" aria-label="Search">
              <IconSearch size={18} />
            </button>
          </form>

          <div className="mobile-nav-links">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>All Products</Link>
            {categories.map(cat => (
              <Link 
                key={cat} 
                to={`/products?category=${encodeURIComponent(cat)}`} 
                className="mobile-nav-link" 
                style={{ fontWeight: 400, paddingLeft: '1rem', fontSize: '0.95rem' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
            <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            
            <Link to="/b2b" className="mobile-nav-cta" onClick={() => setIsMobileMenuOpen(false)}>
              Request Bulk Quote
            </Link>
            
            <Link to="/admin" className="mobile-nav-link" style={{ marginTop: '1rem', color: 'var(--color-brand-secondary)' }} onClick={() => setIsMobileMenuOpen(false)}>
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* --- Cart Drawer --- */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <h2>Shopping Cart</h2>
            <button className="close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close Cart">
              <IconX size={24} />
            </button>
          </div>

          <div className="drawer-content">
            {cart.length === 0 ? (
              <div className="empty-state">
                <IconShoppingCart size={48} style={{ strokeWidth: 1.5, opacity: 0.5 }} />
                <p>Your cart is empty</p>
                <Link
                  to="/products"
                  className="btn-primary"
                  style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  onClick={() => setIsCartOpen(false)}
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartKey} className="cart-item">
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    {item.selectedVariant && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', marginBottom: '0.2rem' }}>
                        {item.selectedVariant.label}
                        {item.selectedVariant.color && ` — ${item.selectedVariant.color}`}
                      </div>
                    )}
                    <div className="item-price">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => removeFromCart(item.cartKey)}>-</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="drawer-footer">
              <div className="total-row">
                <span>Total Amount:</span>
                <span className="total-price">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <button className="btn-success checkout-btn" onClick={handleCheckout}>
                <IconBrandWhatsapp size={20} />
                Order via WhatsApp
              </button>
              <button className="clear-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
