import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Generate a unique cart key: product.id + variant.id (if any)
  const getCartKey = (product) => {
    if (product.selectedVariant) {
      return `${product.id}-v${product.selectedVariant.id || product.selectedVariant.label}`;
    }
    return `${product.id}`;
  };

  const addToCart = (product) => {
    const cartKey = getCartKey(product);
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartKey === cartKey);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1,
        };
        return newCart;
      }

      // Determine the price: variant price takes priority
      const price = product.selectedVariant
        ? product.selectedVariant.price
        : product.price;

      return [...prevCart, {
        ...product,
        cartKey,
        price,
        quantity: 1,
      }];
    });
  };

  const removeFromCart = (cartKey) => {
    setCart((prevCart) =>
      prevCart.reduce((acc, item) => {
        if (item.cartKey === cartKey) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
