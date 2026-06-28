import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ProductContext = createContext();

export const useProduct = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Products
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (prodErr) throw prodErr;

      // Fetch Variants
      const { data: varData, error: varErr } = await supabase
        .from('product_variants')
        .select('*');
        
      let variants = varData || [];
      if (varErr) {
        console.warn('Warning: product_variants table might not exist yet.', varErr);
      }
      
      // Map image_url to image for backwards compatibility with UI
      const mappedProducts = prodData.map(p => {
        const prodVariants = variants.filter(v => v.product_id === p.id).sort((a,b) => a.id - b.id);
        return { 
          ...p, 
          image: p.image_url,
          variants: prodVariants 
        };
      });
      setProducts(mappedProducts || []);

      // Fetch Categories
      const { data: catData, error: catErr } = await supabase
        .from('categories')
        .select('name')
        .order('created_at', { ascending: true });
      if (catErr) throw catErr;

      // Map to array of strings
      setCategories(catData.map(c => c.name));
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Product Actions ──
  const addProduct = async (newProduct) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          price: Number(newProduct.price) || 0,
          category: newProduct.category,
          description: newProduct.description,
          brand: newProduct.brand,
          image_url: newProduct.image
        }])
        .select();
      if (error) throw error;
      
      let newVariants = [];
      if (data && newProduct.variants && newProduct.variants.length > 0) {
        const productId = data[0].id;
        const variantsToInsert = newProduct.variants.map(v => ({
          product_id: productId,
          label: v.label,
          price: Number(v.price),
          color: v.color || null,
          in_stock: v.in_stock !== false
        }));
        
        const { data: varData, error: varErr } = await supabase
          .from('product_variants')
          .insert(variantsToInsert)
          .select();
          
        if (varErr) throw varErr;
        newVariants = varData || [];
      }

      if (data) {
        setProducts([{ ...data[0], image: data[0].image_url, variants: newVariants }, ...products]);
      }
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const editProduct = async (updatedProduct) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          price: Number(updatedProduct.price) || 0,
          category: updatedProduct.category,
          description: updatedProduct.description,
          brand: updatedProduct.brand,
          image_url: updatedProduct.image
        })
        .eq('id', updatedProduct.id)
        .select();
      if (error) throw error;

      let newVariants = [];
      if (updatedProduct.variants !== undefined) {
        // Delete all old variants for this product
        const { error: delErr } = await supabase.from('product_variants').delete().eq('product_id', updatedProduct.id);
        if (delErr) {
           console.warn('Could not delete old variants', delErr);
        }
        
        // Insert new ones if any
        if (updatedProduct.variants.length > 0) {
          const variantsToInsert = updatedProduct.variants.map(v => ({
            product_id: updatedProduct.id,
            label: v.label,
            price: Number(v.price),
            color: v.color || null,
            in_stock: v.in_stock !== false
          }));
          const { data: varData, error: varErr } = await supabase
            .from('product_variants')
            .insert(variantsToInsert)
            .select();
          if (varErr) throw varErr;
          newVariants = varData || [];
        }
      }

      if (data) {
        setProducts(products.map(p => {
          if (p.id === updatedProduct.id) {
            return { 
              ...data[0], 
              image: data[0].image_url, 
              variants: updatedProduct.variants !== undefined ? newVariants : p.variants 
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  // ── Category Actions ──
  const addCategory = async (name) => {
    const trimmed = name.trim();
    if (trimmed && !categories.includes(trimmed)) {
      try {
        const { error } = await supabase
          .from('categories')
          .insert([{ name: trimmed }]);
        if (error) throw error;
        setCategories([...categories, trimmed]);
      } catch (err) {
        console.error('Error adding category:', err);
        throw err;
      }
    }
  };

  const deleteCategory = async (name) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', name);
      if (error) throw error;
      setCategories(categories.filter(c => c !== name));
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  return (
    <ProductContext.Provider value={{
      products, addProduct, editProduct, deleteProduct,
      categories, addCategory, deleteCategory,
      loading, refreshData: fetchData
    }}>
      {children}
    </ProductContext.Provider>
  );
};
