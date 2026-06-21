import React from 'react';
import { IconBulb, IconWind, IconSolarPanel, IconBrandWhatsapp } from '@tabler/icons-react';
import { useCart } from '../context/CartContext';
import './FeaturedProducts.css';

import { useProduct } from '../context/ProductContext';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { products: allProducts } = useProduct();
  const products = allProducts.slice(0, 3); // Take first 3 for featured

  const getIconForCategory = (cat) => {
    switch (cat) {
      case 'LED Lights': return <IconBulb size={48} />;
      case 'Fans': return <IconWind size={48} />;
      case 'Solar': return <IconSolarPanel size={48} />;
      default: return <IconBulb size={48} />;
    }
  };

  const handleWhatsAppAsk = (prod) => {
    const message = `Hi Pothowar Electric, I want to ask about ${prod.name} (Price: Rs. ${prod.price.toLocaleString()}). Is it currently in stock?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923348700655?text=${encoded}`, '_blank');
  };

  return (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 products-grid">
          {products.map(prod => (
            <div key={prod.id} className="prod-card hover-scale">
              <div className="prod-img">
                {React.cloneElement(getIconForCategory(prod.category), { className: 'prod-icon-svg' })}
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
