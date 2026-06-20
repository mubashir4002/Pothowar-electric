import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
  IconBulb,
  IconWind,
  IconSolarPanel,
  IconPlug,
  IconSearch,
  IconBrandWhatsapp,
} from '@tabler/icons-react';
import './Products.css';

const PRODUCT_DATA = [
  // LED Lights
  { id: 1, name: 'LED Bulb 12W', price: 180, category: 'LED Lights', description: 'Energy efficient 12W LED bulb with high brightness and long lifetime.', brand: 'Pothowar Premium' },
  { id: 2, name: 'LED Panel Light 18W', price: 650, category: 'LED Lights', description: 'Slim ceiling panel light, ideal for homes and offices.', brand: 'Philips' },
  { id: 3, name: 'COB Downlight 7W', price: 320, category: 'LED Lights', description: 'Focused beam spot spotlight with adjustable angles.', brand: 'Pothowar Premium' },
  { id: 4, name: 'Flood Light 50W', price: 2200, category: 'LED Lights', description: 'Outdoor waterproof IP66 LED flood light for security and garden lighting.', brand: 'Osaka' },

  // Fans
  { id: 5, name: 'Ceiling Fan 56"', price: 4500, category: 'Fans', description: 'High-speed ceiling fan with pure copper winding and energy-saving design.', brand: 'GFC Fans' },
  { id: 6, name: 'Bracket Fan 18"', price: 3800, category: 'Fans', description: 'Wall-mounted bracket fan with wide sweep angle and remote control option.', brand: 'Royal Fans' },
  { id: 7, name: 'Exhaust Fan 12"', price: 2100, category: 'Fans', description: 'Silent kitchen/bathroom exhaust fan with heavy-duty metal blades.', brand: 'Pak Fan' },
  { id: 8, name: 'Pedestal Fan 24"', price: 6500, category: 'Fans', description: 'Sturdy standing pedestal fan with adjustable height and multi-speed controls.', brand: 'GFC Fans' },

  // Solar
  { id: 9, name: 'Solar Panel 100W', price: 12000, category: 'Solar', description: 'Monocrystalline solar panel for DC fans, lights, and small power setups.', brand: 'Inverex' },
  { id: 10, name: 'Solar Panel 550W', price: 48000, category: 'Solar', description: 'Tier 1 high-efficiency monocrystalline PV module for residential/commercial systems.', brand: 'Longi Solar' },
  { id: 11, name: 'Hybrid Solar Inverter 3KW', price: 135000, category: 'Solar', description: 'Smart hybrid solar inverter with battery backup and net-metering support.', brand: 'Inverex' },
  { id: 12, name: 'Solar Battery 12V 150Ah', price: 45000, category: 'Solar', description: 'Deep cycle tubular battery designed for long-lasting solar backup power.', brand: 'Phoenix' },

  // DB Boxes
  { id: 13, name: 'Distribution Board 8-Way', price: 1500, category: 'DB Boxes', description: 'Flush-mount plastic distribution board with transparent cover for circuit protection.', brand: 'Pothowar Premium' },
  { id: 14, name: 'Distribution Board 16-Way', price: 2800, category: 'DB Boxes', description: 'Double-row metallic distribution cabinet for safety breaker systems.', brand: 'Schneider' },
  { id: 15, name: 'Circuit Breaker SP 20A', price: 350, category: 'DB Boxes', description: 'Single-pole miniature circuit breaker (MCB) for short-circuit protection.', brand: 'Schneider' },
  { id: 16, name: 'Double Pole ELCB 63A', price: 1800, category: 'DB Boxes', description: 'Earth Leakage Circuit Breaker for shock protection and leakage detection.', brand: 'ABB' },
];

const CATEGORIES = ['All', 'LED Lights', 'Fans', 'Solar', 'DB Boxes'];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(135000);

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
    window.open(`https://wa.me/923001234567?text=${encoded}`, '_blank');
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

            {filteredProducts.length === 0 ? (
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
                      {getCategoryIcon(product.category)}
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
                            className="btn-primary card-btn-buy"
                            onClick={() => addToCart(product)}
                          >
                            Buy
                          </button>
                          <button
                            className="btn-success card-btn-ask"
                            onClick={() => handleWhatsAppAsk(product)}
                          >
                            <IconBrandWhatsapp size={16} /> Ask
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
