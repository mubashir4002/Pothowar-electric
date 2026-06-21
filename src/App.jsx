import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import B2B from './pages/B2B';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Components
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import CategoryList from './pages/admin/CategoryList';

import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

function App() {
  return (
    <ProductProvider>
      <CartProvider>
      <Routes>
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="settings" element={<div style={{padding: '2rem'}}>Settings coming soon...</div>} />
        </Route>

        {/* --- PUBLIC ROUTES --- */}
        <Route path="/*" element={
          <div className="page-wrapper">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/b2b" element={<B2B />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;

