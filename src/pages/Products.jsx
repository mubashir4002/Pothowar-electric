import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  IconBulb,
  IconWind,
  IconSolarPanel,
  IconPlug,
  IconSearch,
  IconBrandWhatsapp,
  IconLoader,
} from '@tabler/icons-react';
import { Helmet } from 'react-helmet-async';
import './Products.css';

import { useProduct } from '../context/ProductContext';

const COLOR_MAP = {
  Red: '#ef4444', Black: '#1e293b', Green: '#22c55e', Blue: '#3b82f6',
  Yellow: '#eab308', White: '#f8fafc', Brown: '#92400e', Grey: '#9ca3af',
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'LED Lights':
      return <IconBulb size={40} className="prod-icon-svg" />;
    case 'Fans':
      return <IconWind size={40} className="prod-icon-svg" />;
    case 'Solar':
      return <IconSolarPanel size={40} className="prod-icon-svg" />;
    case 'DB Boxes':
      return <IconPlug size={40} className="prod-icon-svg" />;
    default:
      return <IconBulb size={40} className="prod-icon-svg" />;
  }
};

const Products = () => {
  const { addToCart } = useCart();
  const { products: PRODUCT_DATA, categories, loading } = useProduct();
  const CATEGORIES = ['All', ...categories];
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState(900000);
  const [addedItem, setAddedItem] = useState(null);

  // Track selected variant per product
  const [selectedVariants, setSelectedVariants] = useState({});

  // Sync state if URL changes (e.g. from navbar)
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const getSelectedVariant = (product) => {
    if (!product.variants || product.variants.length === 0) return null;
    const selectedId = selectedVariants[product.id];
    if (selectedId) {
      const found = product.variants.find(v => v.id === selectedId);
      if (found) return found;
    }
    // Default to first in-stock variant, or first overall
    return product.variants.find(v => v.in_stock) || product.variants[0];
  };

  const getDisplayPrice = (product) => {
    const variant = getSelectedVariant(product);
    if (variant) return variant.price;
    return product.price;
  };

  const handleAddToCart = (product) => {
    const variant = getSelectedVariant(product);
    const cartProduct = {
      ...product,
      selectedVariant: variant || null,
    };
    addToCart(cartProduct);

    const addedKey = variant ? `${product.id}-${variant.id}` : `${product.id}`;
    setAddedItem(addedKey);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  const getAddedKey = (product) => {
    const variant = getSelectedVariant(product);
    return variant ? `${product.id}-${variant.id}` : `${product.id}`;
  };

  const getCategoryCount = (cat) => {
    if (cat === 'All') return PRODUCT_DATA.length;
    return PRODUCT_DATA.filter((p) => p.category === cat).length;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(900000);
  };

  const handleWhatsAppAsk = (product) => {
    const variant = getSelectedVariant(product);
    let productDesc = product.name;
    if (variant) {
      productDesc += ` - ${variant.label}`;
      if (variant.color) productDesc += ` (${variant.color})`;
    }
    const price = variant ? variant.price : product.price;
    const message = `Hi Pothowar Electric, I am interested in details regarding "${productDesc}" priced at Rs. ${price.toLocaleString()}. Is this item in stock?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923348700655?text=${encoded}`, '_blank');
  };

  const filteredProducts = PRODUCT_DATA.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    // For price filtering: check base price OR any variant price
    let matchesPrice = product.price <= maxPrice;
    if (product.variants && product.variants.length > 0) {
      matchesPrice = product.variants.some(v => v.price <= maxPrice);
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="products-page">
      <Helmet>
        <title>Catalog & Pricing | Pothowar Electric</title>
        <meta name="description" content="Browse our wide selection of electrical items including LED lights, fans, solar panels, and DB boxes. Get the best wholesale prices in Rawalpindi." />
      </Helmet>
      <div className="container">
        <h1 className="section-title">Product Catalog</h1>
        
        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar">
            {/* Search filter */}
            <div className="filter-group">
              <h3 className="filter-title">Search</h3>
              <div className="search-wrapper">
                <IconSearch size={18} className="search-icon-inside" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories filter */}
            <div className="filter-group">
              <h3 className="filter-title">Categories</h3>
              <div className="cat-filters-list">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span>{cat}</span>
                    <span className="cat-count">{getCategoryCount(cat)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div className="filter-group">
              <h3 className="filter-title">Max Price</h3>
              <div className="price-slider-group">
                <input
                  type="range"
                  className="price-range-slider"
                  min="100"
                  max="900000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="price-range-labels">
                  <span>Min: Rs. 100</span>
                  <span>Max: Rs. {maxPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button className="reset-filters-btn" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </aside>

          {/* Product Listing Area */}
          <main className="catalog-content">
            <div className="catalog-header">
              <span className="catalog-count-text">
                Showing {filteredProducts.length} of {PRODUCT_DATA.length} products
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-secondary)' }}>
                <IconLoader className="spin" size={32} />
                <p style={{ marginTop: '1rem' }}>Loading products from database...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-results">
                <h3 className="no-results-title">No Products Found</h3>
                <p>Try resetting the filters or modifying your search query.</p>
              </div>
            ) : (
              <div className="catalog-grid">
                {filteredProducts.map((product) => {
                  const currentVariant = getSelectedVariant(product);
                  const displayPrice = getDisplayPrice(product);
                  const addedKey = getAddedKey(product);
                  const hasVariants = product.variants && product.variants.length > 0;

                  return (
                    <div key={product.id} className="catalog-card">
                      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card-img-wrapper">
                          <span className="card-badge-cat">{product.category}</span>
                          {product.image
                            ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                            : getCategoryIcon(product.category)
                          }
                        </div>
                      </Link>
                      <div className="card-info">
                        <span className="card-brand">{product.brand}</span>
                        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h3 className="card-name">{product.name}</h3>
                        </Link>
                        <p className="card-desc" title={product.description}>
                          {product.description}
                        </p>

                        {/* Variant Selector */}
                        {hasVariants && (
                          <div className="variant-selector">
                            <select
                              className="variant-select"
                              value={currentVariant?.id || ''}
                              onChange={(e) => {
                                setSelectedVariants(prev => ({
                                  ...prev,
                                  [product.id]: Number(e.target.value)
                                }));
                              }}
                            >
                              {product.variants.map(v => (
                                <option key={v.id} value={v.id} disabled={!v.in_stock}>
                                  {v.label}{v.color ? ` — ${v.color}` : ''}{!v.in_stock ? ' (Out of Stock)' : ''} — Rs. {v.price.toLocaleString()}
                                </option>
                              ))}
                            </select>

                            {/* Color swatches */}
                            {product.variants.some(v => v.color) && (
                              <div className="variant-color-swatches">
                                {product.variants.filter(v => v.color).map(v => (
                                  <span
                                    key={v.id}
                                    className={`swatch-dot ${currentVariant?.id === v.id ? 'active' : ''}`}
                                    style={{ backgroundColor: COLOR_MAP[v.color] || v.color }}
                                    title={`${v.label} — ${v.color}`}
                                    onClick={() => {
                                      if (v.in_stock) {
                                        setSelectedVariants(prev => ({
                                          ...prev,
                                          [product.id]: v.id
                                        }));
                                      }
                                    }}
                                  ></span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="card-bottom">
                          <div className="card-price-row">
                            <span className="card-price-label">PRICE</span>
                            <span className="card-price-val">Rs. {displayPrice.toLocaleString()}</span>
                          </div>
                          <div className="card-buttons">
                            <button
                              className={`btn-primary card-btn-buy ${addedItem === addedKey ? 'added' : ''}`}
                              onClick={() => handleAddToCart(product)}
                              style={addedItem === addedKey ? { backgroundColor: '#10b981', borderColor: '#10b981' } : {}}
                              disabled={currentVariant && !currentVariant.in_stock}
                            >
                              {addedItem === addedKey ? 'Added ✓' : (currentVariant && !currentVariant.in_stock ? 'Out of Stock' : 'Buy')}
                            </button>
                            <button
                              className="btn-success card-btn-ask"
                              onClick={() => handleWhatsAppAsk(product)}
                            >
                              <IconBrandWhatsapp size={16} /> Request Info
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
