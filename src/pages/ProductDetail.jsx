import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { Helmet } from 'react-helmet-async';
import {
  IconArrowLeft,
  IconBrandWhatsapp,
  IconBulb,
  IconWind,
  IconSolarPanel,
  IconPlug,
  IconLoader
} from '@tabler/icons-react';
import './ProductDetail.css';

const COLOR_MAP = {
  Red: '#ef4444', Black: '#1e293b', Green: '#22c55e', Blue: '#3b82f6',
  Yellow: '#eab308', White: '#f8fafc', Brown: '#92400e', Grey: '#9ca3af',
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'LED Lights': return <IconBulb size={80} className="prod-icon-svg" />;
    case 'Fans': return <IconWind size={80} className="prod-icon-svg" />;
    case 'Solar': return <IconSolarPanel size={80} className="prod-icon-svg" />;
    case 'DB Boxes': return <IconPlug size={80} className="prod-icon-svg" />;
    default: return <IconBulb size={80} className="prod-icon-svg" />;
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProduct();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const foundProduct = products.find(p => p.id === Number(id));
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          // Default to first in-stock variant, or first variant overall
          const defaultVariant = foundProduct.variants.find(v => v.in_stock) || foundProduct.variants[0];
          setSelectedVariant(defaultVariant);
        } else {
          setSelectedVariant(null);
        }
      } else {
        // Handle not found
        navigate('/products');
      }
    }
  }, [id, products, loading, navigate]);

  if (loading || !product) {
    return (
      <div className="product-detail-page loading-state">
        <IconLoader className="spin" size={40} />
        <p>Loading product details...</p>
      </div>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const currentPrice = hasVariants ? (selectedVariant ? selectedVariant.price : product.price) : product.price;

  const handleAddToCart = () => {
    addToCart({ ...product, selectedVariant });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWhatsAppAsk = () => {
    let productDesc = product.name;
    if (selectedVariant) {
      productDesc += ` - ${selectedVariant.label}`;
      if (selectedVariant.color) productDesc += ` (${selectedVariant.color})`;
    }
    const message = `Hi, I want to inquire about: ${productDesc} — seen on pothowarelectric.com. Is this item in stock?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923348700655?text=${encoded}`, '_blank');
  };

  // Find Related Products (Same category, exclude current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="product-detail-page">
      <Helmet>
        <title>{product.name} | Pothowar Electric</title>
        <meta 
          name="description" 
          content={`Buy ${product.name} in Rawalpindi. ${product.description.substring(0, 100)}... Contact Pothowar Electric on WhatsApp.`} 
        />
      </Helmet>

      <div className="container">
        {/* Back Link */}
        <Link to="/products" className="back-link">
          <IconArrowLeft size={18} />
          Back to Products
        </Link>

        {/* Main Product Grid */}
        <div className="product-detail-grid">
          {/* Left: Image */}
          <div className="detail-image-col">
            {product.image ? (
              <img src={product.image} alt={product.name} className="detail-main-img" />
            ) : (
              <div className="detail-placeholder-img">
                {getCategoryIcon(product.category)}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="detail-info-col">
            <span className="detail-badge-cat">{product.category}</span>
            <h1 className="detail-title">{product.name}</h1>
            <h3 className="detail-brand">{product.brand}</h3>
            
            <p className="detail-desc">{product.description}</p>

            <div className="detail-price-section">
              <span className="price-label">Price</span>
              <span className="price-val">Rs. {currentPrice.toLocaleString()}</span>
            </div>

            {/* Variants Selector */}
            {hasVariants && (
              <div className="detail-variants-section">
                <h4 className="variants-heading">Select Option:</h4>
                <div className="variants-btn-group">
                  {product.variants.map((v) => {
                    const isActive = selectedVariant && selectedVariant.id === v.id;
                    const isDisabled = !v.in_stock;
                    
                    return (
                      <button
                        key={v.id}
                        className={`variant-select-btn ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => {
                          if (!isDisabled) setSelectedVariant(v);
                        }}
                        disabled={isDisabled}
                      >
                        {v.color && (
                          <span 
                            className="btn-color-swatch"
                            style={{ backgroundColor: COLOR_MAP[v.color] || v.color }}
                          />
                        )}
                        <span>{v.label}</span>
                        {isDisabled && <span className="oos-text">(Out of Stock)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button 
                className={`btn-primary add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={hasVariants && !selectedVariant?.in_stock}
              >
                {addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
              <button className="btn-success whatsapp-ask-btn" onClick={handleWhatsAppAsk}>
                <IconBrandWhatsapp size={20} />
                Ask on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 className="related-title">You may also like</h2>
            <div className="catalog-grid">
              {relatedProducts.map(relProd => {
                const hasRelVariants = relProd.variants && relProd.variants.length > 0;
                const displayPrice = hasRelVariants 
                  ? Math.min(...relProd.variants.map(v => v.price)) 
                  : relProd.price;

                return (
                  <Link to={`/products/${relProd.id}`} key={relProd.id} className="catalog-card hover-scale" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card-img-wrapper">
                      <span className="card-badge-cat">{relProd.category}</span>
                      {relProd.image
                        ? <img src={relProd.image} alt={relProd.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                        : getCategoryIcon(relProd.category)
                      }
                    </div>
                    <div className="card-info">
                      <span className="card-brand">{relProd.brand}</span>
                      <h3 className="card-name" style={{ color: 'var(--color-brand-primary)' }}>{relProd.name}</h3>
                      <div className="card-bottom" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <div className="card-price-row">
                          <span className="card-price-label">FROM</span>
                          <span className="card-price-val">Rs. {displayPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
