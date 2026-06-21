import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  IconLayoutDashboard, 
  IconBox, 
  IconSettings, 
  IconLogout,
  IconBolt,
  IconTag
} from '@tabler/icons-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Basic mock logout logic
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  // Determine title based on current path
  const getPageTitle = () => {
    if (location.pathname.includes('/products')) return 'Product Management';
    if (location.pathname.includes('/categories')) return 'Category Management';
    if (location.pathname.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <IconBolt size={28} color="var(--color-brand-accent)" />
          <span className="admin-logo-text">Pothowar Admin</span>
        </div>
        
        <nav className="admin-nav">
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <IconLayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <IconBox size={20} /> Products
          </NavLink>
          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <IconTag size={20} /> Categories
          </NavLink>
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <IconSettings size={20} /> Settings
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <IconLogout size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1 className="admin-topbar-title">{getPageTitle()}</h1>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-user-profile">
              <div className="admin-avatar">AD</div>
              <span>Admin User</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
