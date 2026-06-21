import React, { useState } from 'react';
import { useProduct } from '../../context/ProductContext';
import { IconPlus, IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import './ProductList.css';

const CATEGORIES = ['LED Lights', 'Fans', 'Solar', 'DB Boxes', 'Other'];

const ProductList = () => {
  const { products, addProduct, editProduct, deleteProduct } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    category: 'LED Lights',
    description: ''
  });

  const openAddModal = () => {
    setCurrentProduct(null);
    setForm({ name: '', brand: '', price: '', category: 'LED Lights', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setForm({ ...product });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: Number(form.price)
    };

    if (currentProduct) {
      editProduct({ ...productData, id: currentProduct.id });
    } else {
      addProduct(productData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      <div className="admin-products-header">
        <button className="btn-primary btn-add-product" onClick={openAddModal}>
          <IconPlus size={20} /> Add Product
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price (Rs)</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td style={{ color: 'var(--color-text-tertiary)' }}>#{product.id}</td>
                <td style={{ fontWeight: 500 }}>{product.name}</td>
                <td>{product.brand}</td>
                <td><span className="badge-category">{product.category}</span></td>
                <td style={{ fontWeight: 600 }}>{product.price.toLocaleString()}</td>
                <td>
                  <div className="action-btns" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn-icon edit" onClick={() => openEditModal(product)} title="Edit">
                      <IconEdit size={18} />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(product.id)} title="Delete">
                      <IconTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No products found. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={closeModal}><IconX size={24} /></button>
            </div>
            
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Product Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. 12W LED Bulb" />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Brand</label>
                    <input type="text" name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Philips" />
                  </div>
                  <div className="form-group">
                    <label>Price (Rs.)</label>
                    <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" placeholder="0" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows="3" required placeholder="Brief description..."></textarea>
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{currentProduct ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
