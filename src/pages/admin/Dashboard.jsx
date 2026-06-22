import React, { useState, useEffect } from 'react';
import { IconShoppingCart, IconUsers, IconPackage, IconCash } from '@tabler/icons-react';
import { useProduct } from '../../context/ProductContext';
import { supabase } from '../../lib/supabase';

const Dashboard = () => {
  const { products } = useProduct();
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    supabase
      .from('inquiries')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setInquiryCount(count || 0));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-brand-primary)' }}>Overview</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem' 
      }}>
        
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(24, 95, 165, 0.1)', color: 'var(--color-brand-primary)', padding: '0.75rem', borderRadius: '8px' }}>
              <IconPackage size={24} />
            </div>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total Products</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{products.length}</div>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '8px' }}>
              <IconShoppingCart size={24} />
            </div>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Recent Orders</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>0</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem' }}>*Orders go to WhatsApp</p>
        </div>

        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '0.75rem', borderRadius: '8px' }}>
              <IconUsers size={24} />
            </div>
            <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>B2B Inquiries</h3>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{inquiryCount}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem' }}>View all in Settings → Inquiries</p>
        </div>

      </div>

      <div style={{ marginTop: '3rem', background: '#fff', padding: '2rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Welcome to your Dashboard</h3>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          This is your administrative control panel. From here, you can manage your website's data.
          <br /><br />
          <strong>Note:</strong> All orders and inquiries are currently routed directly to your WhatsApp to ensure you never miss a lead. 
          Use the <strong>Products</strong> tab on the left to add, edit, or remove items from your live catalog.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
