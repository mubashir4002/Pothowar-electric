import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
const CATEGORIES_FILTER = ['All'];

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
  const [maxPrice, setMaxPrice] = useState(135000);
  const [addedItem, setAddedItem] = useState(null);

  // Sync state if URL changes (e.g. from navbar)
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItem(product.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  const getCategoryCount = (cat) => {
    if (cat === 'All') return PRODUCT_DATA.length;
    return PRODUCT_DATA.filter((p) => p.category === cat).length;
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(135000);
  };

  const handleWhatsAppAsk = (product) => {
    const message = `Hi Pothowar Electric, I am interested in details regarding "${product.name}" priced at Rs. ${product.price.toLocaleString()}. Is this item in stock?`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923348700655?text=${encoded}`, '_blank');
  };

  const filteredProducts = PRODUCT_DATA.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;

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
                  min="180"
                  max="135000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="price-range-labels">
                  <span>Min: Rs. 180</span>
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
                {filteredProducts.map((product) => (
                  <div key={product.id} className="catalog-card">
                    <div className="card-img-wrapper">
                      <span className="card-badge-cat">{product.category}</span>
                      {product.image
                        ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                        : getCategoryIcon(product.category)
                      }
                    </div>
                    <div className="card-info">
                      <span className="card-brand">{product.brand}</span>
                      <h3 className="card-name">{product.name}</h3>
                      <p className="card-desc" title={product.description}>
                        {product.description}
                      </p>
                      <div className="card-bottom">
                        <div className="card-price-row">
                          <span className="card-price-label">PRICE</span>
                          <span className="card-price-val">Rs. {product.price.toLocaleString()}</span>
                        </div>
                        <div className="card-buttons">
                          <button
                            className={`btn-primary card-btn-buy ${addedItem === product.id ? 'added' : ''}`}
                            onClick={() => handleAddToCart(product)}
                            style={addedItem === product.id ? { backgroundColor: '#10b981', borderColor: '#10b981' } : {}}
                          >
                            {addedItem === product.id ? 'Added ✓' : 'Buy'}
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
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
