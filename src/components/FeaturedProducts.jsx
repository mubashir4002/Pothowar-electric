import React, { useState } from 'react';
import { IconBulb, IconWind, IconSolarPanel, IconBrandWhatsapp } from '@tabler/icons-react';
import { useCart } from '../context/CartContext';
import './FeaturedProducts.css';

import { useProduct } from '../context/ProductContext';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { products: allProducts } = useProduct();
  const products = allProducts.slice(0, 3); // Take first 3 for featured
  const [addedItem, setAddedItem] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});

  const getSelectedVariant = (product) => {
    if (!product.variants || product.variants.length === 0) return null;
    const selectedId = selectedVariants[product.id];
    if (selectedId) {
      const found = product.variants.find(v => v.id === selectedId);
      if (found) return found;
    }
    return product.variants.find(v => v.in_stock) || product.variants[0];
  };

  const handleAddToCart = (product) => {
    const variant = getSelectedVariant(product);
    addToCart({ ...product, selectedVariant: variant || null });
    const addedKey = variant ? `${product.id}-${variant.id}` : `${product.id}`;
    setAddedItem(addedKey);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  const getIconForCategory = (cat) => {
    switch (cat) {
      case 'LED Lights': return <IconBulb size={48} />;
      case 'Fans': return <IconWind size={48} />;
      case 'Solar': return <IconSolarPanel size={48} />;
      default: return <IconBulb size={48} />;
    }
  };

  const handleWhatsAppAsk = (prod) => {
    const variant = getSelectedVariant(prod);
    let productDesc = prod.name;
    if (variant) {
      productDesc += ` - ${variant.label}`;
      if (variant.color) productDesc += ` (${variant.color})`;
    }
    const price = variant ? variant.price : prod.price;
    const message = `Hi Pothowar Electric, I want to ask about ${productDesc} (Price: Rs. ${price.toLocaleString()}). Is it currently in stock?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923348700655?text=${encoded}`, '_blank');
  };

  return (
    <section className="products-section">
      <div className="container">
        <h2 className="section-title">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 products-grid">
          {products.map(prod => {
            const currentVariant = getSelectedVariant(prod);
            const displayPrice = currentVariant ? currentVariant.price : prod.price;
            const hasVariants = prod.variants && prod.variants.length > 0;
            const addedKey = currentVariant ? `${prod.id}-${currentVariant.id}` : `${prod.id}`;

            return (
              <div key={prod.id} className="prod-card hover-scale">
                <div className="prod-img">
                  {React.cloneElement(getIconForCategory(prod.category), { className: 'prod-icon-svg' })}
                </div>
                <div className="prod-info">
                  <h3 className="prod-name">{prod.name}</h3>

                  {/* Variant selector for featured products */}
                  {hasVariants && (
                    <select
                      className="variant-select"
                      style={{ marginBottom: '0.5rem', fontSize: '0.8rem', padding: '0.4rem' }}
                      value={currentVariant?.id || ''}
                      onChange={(e) => {
                        setSelectedVariants(prev => ({
                          ...prev,
                          [prod.id]: Number(e.target.value)
                        }));
                      }}
                    >
                      {prod.variants.map(v => (
                        <option key={v.id} value={v.id} disabled={!v.in_stock}>
                          {v.label}{v.color ? ` — ${v.color}` : ''}{!v.in_stock ? ' (Out of Stock)' : ''} — Rs. {v.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="prod-price">Rs. {displayPrice.toLocaleString()}</div>
                  <div className="prod-actions">
                    <button 
                      className={`btn-primary flex-1 ${addedItem === addedKey ? 'added' : ''}`} 
                      onClick={() => handleAddToCart(prod)}
                      style={addedItem === addedKey ? { backgroundColor: '#10b981', borderColor: '#10b981' } : {}}
                      disabled={currentVariant && !currentVariant.in_stock}
                    >
                      {addedItem === addedKey ? 'Added ✓' : (currentVariant && !currentVariant.in_stock ? 'Out of Stock' : 'Buy')}
                    </button>
                    <button className="btn-success flex-1" onClick={() => handleWhatsAppAsk(prod)}>
                      <IconBrandWhatsapp size={16} /> Request Info
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
