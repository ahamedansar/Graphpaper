import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from local storage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Sync cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, sizeQuantities) => {
    // sizeQuantities is an object: { S: 10, M: 20 }
    let updatedCart = [...cartItems];

    Object.entries(sizeQuantities).forEach(([size, qty]) => {
      if (qty > 0) {
        const cartId = `${product._id}-${size}`;
        const existingItemIndex = updatedCart.findIndex(item => item.cartId === cartId);

        if (existingItemIndex > -1) {
          updatedCart[existingItemIndex].qty += qty;
        } else {
          updatedCart.push({
            cartId,
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            size,
            qty
          });
        }
      }
    });

    setCartItems(updatedCart);
  };

  const removeFromCart = (cartId) => {
    setCartItems(cartItems.filter(item => item.cartId !== cartId));
  };

  const updateQty = (cartId, newQty) => {
    if (newQty < 1) return;
    setCartItems(cartItems.map(item =>
      item.cartId === cartId ? { ...item, qty: parseInt(newQty, 10) } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
