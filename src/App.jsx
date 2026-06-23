import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import B2B from './pages/B2B';
import About from './pages/About';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';

// Admin Components
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import CategoryList from './pages/admin/CategoryList';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';

import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AuthProvider } from './context/AuthContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <StoreSettingsProvider>
          <ProductProvider>
            <CartProvider>
              <ScrollToTop />
              <Routes>
                {/* --- ADMIN ROUTES --- */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="categories" element={<CategoryList />} />
                  <Route path="settings" element={<Settings />} />
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
        </StoreSettingsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
