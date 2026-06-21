import React, { useState, useRef } from 'react';
import { useProduct } from '../../context/ProductContext';
import { supabase } from '../../lib/supabase';
import { IconPlus, IconEdit, IconTrash, IconX, IconPhoto, IconUpload, IconLoader } from '@tabler/icons-react';
import './ProductList.css';

const ProductList = () => {
  const { products, addProduct, editProduct, deleteProduct, categories } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const fileInputRef = useRef(null);

  const blankForm = {
    name: '',
    brand: '',
    price: '',
    category: categories[0] || '',
    description: '',
    image: null,
  };

  const [form, setForm] = useState(blankForm);

  const openAddModal = () => {
    setCurrentProduct(null);
    setForm({ ...blankForm, category: categories[0] || '' });
    setImagePreview(null);
    setImageFile(null);
    setNewCategoryInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setForm({ ...product });
    setImagePreview(product.image || null);
    setImageFile(null);
    setNewCategoryInput('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setImagePreview(null);
    setImageFile(null);
    setNewCategoryInput('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setForm(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let imageUrl = form.image; // This might be base64 preview or old URL

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const productData = {
        ...form,
        price: Number(form.price),
        image: imageUrl, // Pass Supabase URL instead of Base64
      };

      if (currentProduct) {
        await editProduct({ ...productData, id: currentProduct.id });
      } else {
        await addProduct(productData);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Check console.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      <div className="admin-products-header">
        <h2 className="admin-products-title">All Products ({products.length})</h2>
        <button className="btn-primary btn-add-product" onClick={openAddModal}>
          <IconPlus size={20} /> Add Product
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
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
                <td>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid #E5E7EB' }}
                    />
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: 6, border: '1px dashed #D1D5DB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#9CA3AF', background: '#F9FAFB'
                    }}>
                      <IconPhoto size={20} />
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: 500 }}>{product.name}</td>
                <td>{product.brand}</td>
                <td><span className="badge-category">{product.category}</span></td>
                <td style={{ fontWeight: 600 }}>Rs. {product.price.toLocaleString()}</td>
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
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-tertiary)' }}>
                  No products yet. Click "Add Product" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{currentProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="modal-close" onClick={closeModal}><IconX size={24} /></button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="modal-body modal-body-grid">

                {/* Left column: Image Upload */}
                <div className="modal-image-col">
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                    Product Image
                  </label>

                  {/* Image Preview / Upload Zone */}
                  <div
                    className="image-upload-zone"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="image-preview-img" />
                    ) : (
                      <div className="image-upload-placeholder">
                        <IconUpload size={32} style={{ color: '#9CA3AF' }} />
                        <p>Click to upload</p>
                        <span>JPG, PNG, WEBP</span>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />

                  {imagePreview && (
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                    >
                      <IconX size={14} /> Remove Image
                    </button>
                  )}
                </div>

                {/* Right column: Product Fields */}
                <div className="modal-fields-col">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. LED Bulb 12W" />
                  </div>

                  <div className="modal-row-2">
                    <div className="form-group">
                      <label>Brand *</label>
                      <input type="text" name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Philips" />
                    </div>
                    <div className="form-group">
                      <label>Price (Rs.) *</label>
                      <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" placeholder="0" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="new-category-inline">
                      <input
                        type="text"
                        placeholder="Or type a new category name…"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                      />
                      <button
                        type="button"
                        className="add-cat-inline-btn"
                        disabled={!newCategoryInput.trim() || categories.includes(newCategoryInput.trim())}
                        onClick={() => {
                          if (newCategoryInput.trim()) {
                            setForm(prev => ({ ...prev, category: newCategoryInput.trim() }));
                            setNewCategoryInput('');
                          }
                        }}
                      >
                        Use
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="3"
                      required
                      placeholder="Brief product description…"
                    ></textarea>
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={closeModal} disabled={isUploading}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isUploading}>
                  {isUploading ? 'Saving...' : (currentProduct ? 'Save Changes' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
