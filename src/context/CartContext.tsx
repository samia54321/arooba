import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem } from '../types.ts';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'itemTotal'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  appliedPromo: string | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vero_forno_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('vero_forno_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const calculateItemTotal = (item: Omit<CartItem, 'id' | 'itemTotal'>): number => {
    const toppingsTotal = item.extraToppings.reduce((sum, t) => sum + t.price, 0);
    return Number(((item.sizePrice + toppingsTotal) * item.quantity).toFixed(2));
  };

  const addItem = (newItemData: Omit<CartItem, 'id' | 'itemTotal'>) => {
    const itemTotal = calculateItemTotal(newItemData);
    const id = `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullItem: CartItem = {
      ...newItemData,
      id,
      itemTotal
    };

    setItems(prev => {
      // Check if identical item already in cart (same pizza, size, crust, extra toppings, instructions)
      const existingIdx = prev.findIndex(item =>
        item.pizzaId === fullItem.pizzaId &&
        item.size === fullItem.size &&
        item.crust === fullItem.crust &&
        item.specialInstructions === fullItem.specialInstructions &&
        JSON.stringify(item.extraToppings.map(t => t.name).sort()) === JSON.stringify(fullItem.extraToppings.map(t => t.name).sort())
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        const updatedQty = copy[existingIdx].quantity + fullItem.quantity;
        const singlePrice = copy[existingIdx].sizePrice + copy[existingIdx].extraToppings.reduce((sum, t) => sum + t.price, 0);
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: updatedQty,
          itemTotal: Number((singlePrice * updatedQty).toFixed(2))
        };
        return copy;
      }

      return [...prev, fullItem];
    });

    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          const singlePrice = item.sizePrice + item.extraToppings.reduce((sum, t) => sum + t.price, 0);
          return {
            ...item,
            quantity: newQty,
            itemTotal: Number((singlePrice * newQty).toFixed(2))
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const subtotal = useMemo(() => {
    return Number(items.reduce((sum, i) => sum + i.itemTotal, 0).toFixed(2));
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= 35 ? 0 : 3.99; // Free delivery over $35
  }, [items, subtotal]);

  const tax = useMemo(() => {
    return Number((subtotal * 0.085).toFixed(2)); // 8.5% tax
  }, [subtotal]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo === 'FORNO5') return Math.min(5, subtotal);
    if (appliedPromo === 'PIZZA10') return Number((subtotal * 0.1).toFixed(2));
    return 0;
  }, [appliedPromo, subtotal]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    const computed = subtotal - discount + tax + deliveryFee;
    return Number(Math.max(0, computed).toFixed(2));
  }, [subtotal, discount, tax, deliveryFee, items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, i) => sum + i.quantity, 0);
  }, [items]);

  const applyPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FORNO5') {
      setAppliedPromo('FORNO5');
      return { success: true, message: '$5.00 off applied!' };
    }
    if (cleanCode === 'PIZZA10') {
      setAppliedPromo('PIZZA10');
      return { success: true, message: '10% discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try "FORNO5" or "PIZZA10".' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        deliveryFee,
        tax,
        discount,
        appliedPromo,
        applyPromo,
        removePromo,
        total,
        itemCount
      }}
    >
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
