import React, { useState, useRef } from 'react';
import { useProduct } from '../../context/ProductContext';
import { supabase } from '../../lib/supabase';
import { IconPlus, IconEdit, IconTrash, IconX, IconPhoto, IconUpload, IconLoader } from '@tabler/icons-react';
import './ProductList.css';

const COLOR_PRESETS = ['Red', 'Black', 'Green', 'Blue', 'Yellow', 'White', 'Brown', 'Grey'];

const ProductList = () => {
  const { products, addProduct, editProduct, deleteProduct, categories } = useProduct();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const fileInputRef = useRef(null);

  // Variants state
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);

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
    setHasVariants(false);
    setVariants([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setForm({ ...product });
    setImagePreview(product.image || null);
    setImageFile(null);
    setNewCategoryInput('');

    // Load existing variants
    if (product.variants && product.variants.length > 0) {
      setHasVariants(true);
      setVariants(product.variants.map(v => ({
        label: v.label,
        price: v.price,
        color: v.color || '',
        in_stock: v.in_stock !== false,
        showColor: !!v.color
      })));
    } else {
      setHasVariants(false);
      setVariants([]);
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setImagePreview(null);
    setImageFile(null);
    setNewCategoryInput('');
    setHasVariants(false);
    setVariants([]);
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

  // ── Variant Helpers ──
  const addVariantRow = () => {
    setVariants(prev => [...prev, { label: '', price: '', color: '', in_stock: true, showColor: false }]);
  };

  const updateVariant = (index, field, value) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const moveVariant = (index, direction) => {
    const newVariants = [...variants];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newVariants.length) return;
    [newVariants[index], newVariants[targetIndex]] = [newVariants[targetIndex], newVariants[index]];
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    let imageUrl = form.image;

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

      // Set the price: if variants exist, use the first variant price as fallback
      const basePrice = hasVariants && variants.length > 0
        ? Number(variants[0].price)
        : Number(form.price);

      const productData = {
        ...form,
        price: basePrice,
        image: imageUrl,
        variants: hasVariants ? variants.map(v => ({
          label: v.label,
          price: Number(v.price),
          color: v.showColor ? v.color : null,
          in_stock: v.in_stock
        })) : [],
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

  // Helper to display price in the table
  const getDisplayPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) return `Rs. ${min.toLocaleString()}`;
      return `Rs. ${min.toLocaleString()} – ${max.toLocaleString()}`;
    }
    return `Rs. ${product.price.toLocaleString()}`;
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
                <td style={{ fontWeight: 500 }}>
                  {product.name}
                  {product.variants && product.variants.length > 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-brand-secondary)', marginLeft: '0.5rem', fontWeight: 400 }}>
                      ({product.variants.length} variants)
                    </span>
                  )}
                </td>
                <td>{product.brand}</td>
                <td><span className="badge-category">{product.category}</span></td>
                <td style={{ fontWeight: 600 }}>{getDisplayPrice(product)}</td>
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

                  <div className="form-group">
                    <label>Brand *</label>
                    <input type="text" name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Philips" />
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

                  {/* ── VARIANTS TOGGLE ── */}
                  <div className="variants-toggle-container">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={hasVariants}
                        onChange={(e) => {
                          setHasVariants(e.target.checked);
                          if (e.target.checked && variants.length === 0) {
                            addVariantRow();
                          }
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="variants-toggle-label">This product has variants</span>
                  </div>

                  {/* ── SINGLE PRICE (no variants) ── */}
                  {!hasVariants && (
                    <div className="form-group">
                      <label>Price (Rs.) *</label>
                      <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" placeholder="0" />
                    </div>
                  )}

                  {/* ── VARIANTS MANAGER ── */}
                  {hasVariants && (
                    <div className="variants-manager">
                      <div className="variants-header">
                        <h4>Variants ({variants.length})</h4>
                        <button type="button" className="btn-add-variant" onClick={addVariantRow}>
                          <IconPlus size={16} /> Add Variant
                        </button>
                      </div>

                      {variants.map((variant, index) => (
                        <div className="variant-row" key={index}>
                          {/* Label */}
                          <input
                            type="text"
                            placeholder="Label (e.g. 3kW, 7/29)"
                            value={variant.label}
                            onChange={(e) => updateVariant(index, 'label', e.target.value)}
                            required
                          />

                          {/* Price */}
                          <input
                            type="number"
                            placeholder="Price"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, 'price', e.target.value)}
                            required
                            min="0"
                          />

                          {/* Color */}
                          <div className="variant-color-wrapper">
                            {variant.showColor ? (
                              <>
                                <select
                                  value={COLOR_PRESETS.includes(variant.color) ? variant.color : 'Other'}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateVariant(index, 'color', val === 'Other' ? '' : val);
                                  }}
                                >
                                  <option value="">-- Color --</option>
                                  {COLOR_PRESETS.map(c => <option key={c} value={c}>{c}</option>)}
                                  <option value="Other">Other</option>
                                </select>
                                {!COLOR_PRESETS.includes(variant.color) && variant.color !== '' && (
                                  <input
                                    type="text"
                                    placeholder="Custom"
                                    value={variant.color}
                                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                    style={{ width: '80px' }}
                                  />
                                )}
                                {/* Show if user selected "Other" and color is empty */}
                                {!COLOR_PRESETS.includes(variant.color) && variant.color === '' && (
                                  <input
                                    type="text"
                                    placeholder="Type color"
                                    value=""
                                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                    style={{ width: '80px' }}
                                  />
                                )}
                              </>
                            ) : (
                              <button
                                type="button"
                                style={{
                                  fontSize: '0.8rem', padding: '0.3rem 0.5rem', border: '1px dashed #cbd5e1',
                                  background: 'transparent', borderRadius: '4px', cursor: 'pointer', color: '#64748b', whiteSpace: 'nowrap'
                                }}
                                onClick={() => updateVariant(index, 'showColor', true)}
                              >
                                + Color
                              </button>
                            )}
                          </div>

                          {/* In Stock Toggle */}
                          <label className="variant-stock-toggle">
                            <input
                              type="checkbox"
                              checked={variant.in_stock}
                              onChange={(e) => updateVariant(index, 'in_stock', e.target.checked)}
                              style={{ width: 'auto' }}
                            />
                            {variant.in_stock ? 'In Stock' : 'Out'}
                          </label>

                          {/* Delete */}
                          <button type="button" className="btn-delete-variant" onClick={() => removeVariant(index)}>
                            <IconTrash size={16} />
                          </button>
                        </div>
                      ))}

                      {variants.length === 0 && (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                          No variants yet. Click "Add Variant" to add one.
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn-outline" onClick={closeModal} disabled={isUploading}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={isUploading || (hasVariants && variants.length === 0)}>
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
