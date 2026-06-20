import React from 'react';
import { IconBulb, IconWind, IconSolarPanel, IconBrandWhatsapp } from '@tabler/icons-react';
import { useCart } from '../context/CartContext';
import './FeaturedProducts.css';

const products = [
  { id: 101, name: 'LED Bulb 12W', price: 180, icon: <IconBulb size={48} /> },
  { id: 102, name: 'Ceiling Fan 56"', price: 4500, icon: <IconWind size={48} /> },
  { id: 103, name: 'Solar Panel 100W', price: 12000, icon: <IconSolarPanel size={48} /> },
];

const FeaturedProducts = () => {
  const { addToCart } = useCart();

  const handleWhatsAppAsk = (prod) => {
    const message = `Hi Pothowar Electric, I want to ask about ${prod.name} (Price: Rs. ${prod.price.toLocaleString()}). Is it currently in stock?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923001234567?text=${encoded}`, '_blank');
  };

  return (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 products-grid">
          {products.map(prod => (
            <div key={prod.id} className="prod-card hover-scale">
              <div className="prod-img">
                {React.cloneElement(prod.icon, { className: 'prod-icon-svg' })}
              </div>
              <div className="prod-info">
                <h3 className="prod-name">{prod.name}</h3>
                <div className="prod-price">Rs. {prod.price.toLocaleString()}</div>
                <div className="prod-actions">
                  <button className="btn-primary flex-1" onClick={() => addToCart(prod)}>Buy</button>
                  <button className="btn-success flex-1" onClick={() => handleWhatsAppAsk(prod)}>
                    <IconBrandWhatsapp size={16} /> Ask
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
