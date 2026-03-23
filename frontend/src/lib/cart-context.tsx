'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { getApiUrl } from './api';

const API_URL = getApiUrl();

export interface CartItem {
  id?: string | number; // Database ID for authenticated users, string ID for guests
  productId: number;
  productName: string;
  packageId: string;
  packageName: string; // e.g., "7 days · 7 pouches"
  price: number;
  origPrice?: number;
  quantity: number;
  image: string; // First image from package
  duration: string;
  pouches: number;
}

// For local cart (guests)
export interface LocalCartItem extends CartItem {
  id: string; // Unique ID: productId-packageId for guests
}

// Server cart item response
interface ServerCartItem {
  id: number;
  productId: number;
  packageId: string;
  quantity: number;
  price: number | string;
  cartId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartContextType {
  items: (CartItem | LocalCartItem)[];
  totalPrice: number;
  totalItems: number;
  addToCart: (item: CartItem | LocalCartItem) => Promise<void>;
  removeFromCart: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_STORAGE_KEY = 'plainfuel_guest_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [items, setItems] = useState<(CartItem | LocalCartItem)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart on mount or when auth status changes
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (user && token) {
          // Authenticated user - load from server
          try {
            const response = await fetch(`${API_URL}/cart`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              // Convert server cart items to client format
              const cartItems = data.items.map((item: ServerCartItem) => ({
                id: item.id,
                productId: item.productId,
                packageId: item.packageId,
                quantity: item.quantity,
                price: parseFloat(item.price.toString()),
                // These fields will need to be filled from product data
                productName: '',
                packageName: '',
                image: '',
                duration: '',
                pouches: 0,
                origPrice: 0,
              }));
              setItems(cartItems);
            } else {
              setItems([]);
            }
          } catch (err) {
            console.error('Failed to load cart from server:', err);
            setItems([]);
          }
        } else {
          // Guest user - load from localStorage
          try {
            const savedCart = localStorage.getItem(GUEST_CART_STORAGE_KEY);
            if (savedCart) {
              const parsedCart = JSON.parse(savedCart);
              setItems(Array.isArray(parsedCart) ? parsedCart : []);
            } else {
              setItems([]);
            }
          } catch (err) {
            console.error('Failed to load guest cart from localStorage:', err);
            setItems([]);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [user, token]);

  // Save guest cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && !user) {
      localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoading, user]);

  const addToCart = async (newItem: CartItem | LocalCartItem) => {
    if (user && token) {
      // Authenticated user - add to server
      try {
        const response = await fetch(`${API_URL}/cart/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: newItem.productId,
            packageId: newItem.packageId,
            quantity: newItem.quantity,
            price: newItem.price,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Update local state with server response
          const existingIndex = items.findIndex(
            (item) => item.productId === newItem.productId && item.packageId === newItem.packageId
          );

          if (existingIndex > -1) {
            // Update existing item
            const updated = [...items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...newItem,
              id: data.item.id,
              quantity: data.item.quantity,
            };
            setItems(updated);
          } else {
            // Add new item
            setItems([...items, { ...newItem, id: data.item.id }]);
          }
        }
      } catch (err) {
        console.error('Failed to add item to cart:', err);
      }
    } else {
      // Guest user - use localStorage
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => (item as LocalCartItem).id === (newItem as LocalCartItem).id ||
                    (item.productId === newItem.productId && item.packageId === newItem.packageId)
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + newItem.quantity,
          };
          return updated;
        }

        // Ensure guest items have an id
        if (!(newItem as LocalCartItem).id) {
          (newItem as LocalCartItem).id = `${newItem.productId}-${newItem.packageId}`;
        }

        return [...prevItems, newItem];
      });
    }
  };

  const removeFromCart = async (id: string | number) => {
    if (user && token) {
      // Authenticated user - delete from server
      try {
        const response = await fetch(`${API_URL}/cart/items/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        }
      } catch (err) {
        console.error('Failed to remove item from cart:', err);
      }
    } else {
      // Guest user - remove from localStorage
      setItems((prevItems) => prevItems.filter((item) => (item as LocalCartItem).id !== id));
    }
  };

  const updateQuantity = async (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    if (user && token) {
      // Authenticated user - update on server
      try {
        const response = await fetch(`${API_URL}/cart/items/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        });

        if (response.ok) {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, quantity } : item
            )
          );
        }
      } catch (err) {
        console.error('Failed to update cart item:', err);
      }
    } else {
      // Guest user - update localStorage
      setItems((prevItems) =>
        prevItems.map((item) =>
          (item as LocalCartItem).id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user && token) {
      // Authenticated user - clear on server
      try {
        const response = await fetch(`${API_URL}/cart`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setItems([]);
        }
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      // Guest user - clear localStorage
      setItems([]);
      localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    }
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalPrice,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
