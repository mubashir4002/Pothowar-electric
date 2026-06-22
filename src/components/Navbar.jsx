import React from 'react';
import { Link } from 'react-router-dom';
import { IconBolt, IconSearch, IconShoppingCart, IconX, IconBrandWhatsapp, IconMenu2 } from '@tabler/icons-react';
import { useCart } from '../context/CartContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleCheckout = () => {
    const itemsText = cart
      .map((item) => `- ${item.name} (Qty: ${item.quantity}) @ Rs. ${item.price.toLocaleString()}`)
      .join('\n');
    const message = `Hello ${settings.storeName}, I would like to place an order for the following items:\n\n${itemsText}\n\n*Total Amount:* Rs. ${cartTotal.toLocaleString()}\n\nPlease confirm availability and delivery terms.`;
    const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encoded}`, '_blank');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-logo hover-scale">
            <IconBolt size={24} className="logo-icon" />
            <span>{settings.storeName}</span>
          </Link>
          <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/products" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            <Link to="/b2b" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Bulk Order</Link>
            <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <div className="nav-icons-mobile-wrapper">
              <button className="icon-btn hover-scale cart-btn" aria-label="Cart" onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}>
                <IconShoppingCart size={20} />
                <span className="cart-badge">{cartCount}</span>
              </button>
            </div>
          </div>
          <div className="nav-icons-desktop">
            <button className="icon-btn hover-scale cart-btn" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
              <IconShoppingCart size={20} />
              <span className="cart-badge">{cartCount}</span>
            </button>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
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
                <div key={item.id} className="cart-item">
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-price">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => removeFromCart(item.id)}>-</button>
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
