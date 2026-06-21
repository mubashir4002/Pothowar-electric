import React, { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

const INITIAL_PRODUCTS = [
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

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  const addProduct = (newProduct) => {
    // Generate a new ID based on the highest existing ID + 1
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { ...newProduct, id: nextId }]);
  };

  const editProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, editProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
