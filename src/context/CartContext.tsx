import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string; // Identificador único en el carrito (productId + variantId)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  variantId?: string;
  variantName?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('terasmart-cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('terasmart-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(item => item.id === newItem.id);
      if (existing) {
        return prev.map(item => 
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => 
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          // No permitimos que la cantidad baje de 1. Para eliminar se usa removeFromCart
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart, totalQuantity, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe ser usado dentro de un CartProvider');
  return context;
};
