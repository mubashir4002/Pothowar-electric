import React from 'react';
import { Link } from 'react-router-dom';
import { IconBolt, IconSearch, IconShoppingCart, IconX, IconBrandWhatsapp } from '@tabler/icons-react';
import { useCart } from '../context/CartContext';
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

  const handleCheckout = () => {
    const itemsText = cart
      .map((item) => `- ${item.name} (Qty: ${item.quantity}) @ Rs. ${item.price.toLocaleString()}`)
      .join('\n');
    const message = `Hello Pothowar Electric, I would like to place an order for the following items:\n\n${itemsText}\n\n*Total Amount:* Rs. ${cartTotal.toLocaleString()}\n\nPlease confirm availability and delivery terms.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923001234567?text=${encoded}`, '_blank');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-logo hover-scale">
            <IconBolt size={24} className="logo-icon" />
            <span>Pothowar Electric</span>
          </Link>
          <div className="nav-links">
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/b2b" className="nav-link">Bulk Order</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <button className="icon-btn hover-scale" aria-label="Search">
              <IconSearch size={20} />
            </button>
            <button
              className="icon-btn hover-scale cart-btn"
              aria-label="Cart"
              onClick={() => setIsCartOpen(true)}
            >
              <IconShoppingCart size={20} />
              <span className="cart-badge">{cartCount}</span>
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
