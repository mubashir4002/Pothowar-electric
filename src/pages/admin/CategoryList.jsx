import React, { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import { IconPlus, IconTrash, IconTag } from '@tabler/icons-react';

const CategoryList = () => {
  const { categories, addCategory, deleteCategory, products } = useProduct();
  const [newCat, setNewCat] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = newCat.trim();
    if (!trimmed) { setError('Category name cannot be empty.'); return; }
    if (categories.includes(trimmed)) { setError('This category already exists.'); return; }
    addCategory(trimmed);
    setNewCat('');
    setError('');
  };

  const handleDelete = (cat) => {
    const count = products.filter(p => p.category === cat).length;
    const msg = count > 0
      ? `"${cat}" has ${count} product(s). Deleting it will not remove those products, but they will show an unlisted category. Continue?`
      : `Are you sure you want to delete the category "${cat}"?`;
    if (window.confirm(msg)) {
      deleteCategory(cat);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--color-brand-primary)', fontSize: '1.5rem' }}>
          Categories ({categories.length})
        </h2>
      </div>

      {/* Add Category Form */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--color-text-primary)' }}>Add New Category</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={newCat}
              onChange={(e) => { setNewCat(e.target.value); setError(''); }}
              placeholder="e.g. Wiring & Cable"
              style={{
                width: '100%', padding: '0.75rem 1rem', border: '1px solid #E5E7EB',
                borderRadius: 6, fontFamily: 'inherit', fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem' }}>{error}</p>}
          </div>
          <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}>
            <IconPlus size={18} /> Add Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Category Name
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Products
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => {
              const count = products.filter(p => p.category === cat).length;
              return (
                <tr key={cat} style={{ borderTop: i === 0 ? 'none' : '1px solid #E5E7EB' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: 'var(--color-brand-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-brand-primary)'
                    }}>
                      <IconTag size={16} />
                    </div>
                    <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{cat}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      background: count > 0 ? '#e0f2fe' : '#F3F4F6',
                      color: count > 0 ? '#0284c7' : '#9CA3AF',
                      padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600
                    }}>
                      {count} product{count !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(cat)}
                      title={`Delete ${cat}`}
                      style={{ marginLeft: 'auto' }}
                    >
                      <IconTrash size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                  No categories yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
