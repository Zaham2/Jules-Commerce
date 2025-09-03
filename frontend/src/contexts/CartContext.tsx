import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { Product } from '../components/ProductGrid';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (cartItemId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id, quantity }),
        });
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items);
        }
      } catch (error) {
        console.error('Failed to add to cart', error);
      }
    } else {
      // Guest cart logic
      const newCartItems = [...cartItems];
      const existingItem = newCartItems.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        newCartItems.push({ id: Date.now(), product, quantity });
      }
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (isAuthenticated) {
      try {
        const response = await fetch(`/api/cart/item/${cartItemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items);
        }
      } catch (error) {
        console.error('Failed to remove from cart', error);
      }
    } else {
      // Guest cart logic
      const newCartItems = cartItems.filter(item => item.id !== cartItemId);
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    if (!isAuthenticated) {
      localStorage.removeItem('cart');
    }
    // For authenticated users, the cart is cleared on the backend after an order
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
