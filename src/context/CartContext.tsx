import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, ItemVariant } from '../types';

interface CartContextType {
  roomNumber: string;
  setRoomNumber: (room: string) => void;
  token: string;
  isRoomVerified: boolean;
  setRoomDetails: (room: string, token: string, verified: boolean) => void;
  items: CartItem[];
  addItem: (item: MenuItem, variant?: ItemVariant, note?: string) => void;
  removeItem: (itemId: string, variantName?: string) => void;
  updateQuantity: (itemId: string, quantity: number, variantName?: string) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  specialInstructions: string;
  setSpecialInstructions: (val: string) => void;
  guestName: string;
  setGuestName: (val: string) => void;
  guestPhone: string;
  setGuestPhone: (val: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mapple_inn_guest_cart';
const ROOM_STORAGE_KEY = 'mapple_inn_guest_room';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomNumber, setRoomNumberState] = useState<string>(() => {
    const saved = localStorage.getItem(`${ROOM_STORAGE_KEY}_num`);
    if (saved && (saved.startsWith('20') || saved.startsWith('30'))) {
      return saved;
    }
    return '201'; // Default valid room in Hotel Mapple Inn
  });

  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem(`${ROOM_STORAGE_KEY}_tok`) || '';
  });

  const [isRoomVerified, setIsRoomVerified] = useState<boolean>(() => {
    return localStorage.getItem(`${ROOM_STORAGE_KEY}_verified`) === 'true';
  });

  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [guestName, setGuestName] = useState<string>(() => localStorage.getItem('mapple_guest_name') || '');
  const [guestPhone, setGuestPhone] = useState<string>(() => localStorage.getItem('mapple_guest_phone') || '');

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (guestName) localStorage.setItem('mapple_guest_name', guestName);
    if (guestPhone) localStorage.setItem('mapple_guest_phone', guestPhone);
  }, [guestName, guestPhone]);

  const setRoomNumber = (room: string) => {
    setRoomNumberState(room);
    localStorage.setItem(`${ROOM_STORAGE_KEY}_num`, room);
  };

  const setRoomDetails = (room: string, tok: string, verified: boolean) => {
    setRoomNumberState(room);
    setToken(tok);
    setIsRoomVerified(verified);
    localStorage.setItem(`${ROOM_STORAGE_KEY}_num`, room);
    localStorage.setItem(`${ROOM_STORAGE_KEY}_tok`, tok);
    localStorage.setItem(`${ROOM_STORAGE_KEY}_verified`, String(verified));
  };

  const addItem = (item: MenuItem, variant?: ItemVariant, note?: string) => {
    setItems(prev => {
      const existingIdx = prev.findIndex(
        ci => ci.menu_item.id === item.id && ci.variant?.name === variant?.name
      );

      const unitPrice = variant ? variant.price : item.price;

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          quantity: copy[existingIdx].quantity + 1,
          note: note !== undefined ? note : copy[existingIdx].note,
        };
        return copy;
      }

      return [
        ...prev,
        {
          menu_item: item,
          variant,
          quantity: 1,
          unitPrice,
          note,
        },
      ];
    });
  };

  const removeItem = (itemId: string, variantName?: string) => {
    setItems(prev =>
      prev.filter(
        ci => !(ci.menu_item.id === itemId && ci.variant?.name === variantName)
      )
    );
  };

  const updateQuantity = (itemId: string, quantity: number, variantName?: string) => {
    if (quantity <= 0) {
      removeItem(itemId, variantName);
      return;
    }
    setItems(prev =>
      prev.map(ci => {
        if (ci.menu_item.id === itemId && ci.variant?.name === variantName) {
          return { ...ci, quantity };
        }
        return ci;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setSpecialInstructions('');
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST
  const totalAmount = subtotal + taxAmount;

  return (
    <CartContext.Provider
      value={{
        roomNumber,
        setRoomNumber,
        token,
        isRoomVerified,
        setRoomDetails,
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItemCount,
        subtotal,
        taxAmount,
        totalAmount,
        specialInstructions,
        setSpecialInstructions,
        guestName,
        setGuestName,
        guestPhone,
        setGuestPhone,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
