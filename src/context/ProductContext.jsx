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
      
      // Map image_url to image for backwards compatibility with UI
      const mappedProducts = prodData.map(p => ({ ...p, image: p.image_url }));
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
          price: Number(newProduct.price),
          category: newProduct.category,
          description: newProduct.description,
          brand: newProduct.brand,
          image_url: newProduct.image // It might be a Supabase Storage URL now
        }])
        .select();
      if (error) throw error;
      if (data) {
        setProducts([{ ...data[0], image: data[0].image_url }, ...products]);
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
          price: Number(updatedProduct.price),
          category: updatedProduct.category,
          description: updatedProduct.description,
          brand: updatedProduct.brand,
          image_url: updatedProduct.image
        })
        .eq('id', updatedProduct.id)
        .select();
      if (error) throw error;
      if (data) {
        setProducts(products.map(p => p.id === updatedProduct.id ? { ...data[0], image: data[0].image_url } : p));
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
