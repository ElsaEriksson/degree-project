"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState } from "react";
import React, { useEffect } from "react";
import { getCartItems } from "./lib/actions";
import { CartItems } from "./models/Cart";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}

interface HeaderContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isAuthFormOpen: boolean;
  setAuthFormOpen: (isOpen: boolean) => void;
  favoritesCount: number;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthFormOpen, setAuthFormOpen] = useState(false);

  const favoritesCount = 2; // This could be fetched from an API or state management solution
  const cartCount = 3; // This could be fetched from an API or state management solution

  const value = {
    isMenuOpen,
    setIsMenuOpen,
    isCartOpen,
    setIsCartOpen,
    isAuthFormOpen,
    setAuthFormOpen,
    favoritesCount,
  };

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}

interface CartContextType {
  cartItems: number;
  setCartItems: (cartCount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<number>(0);

  useEffect(() => {
    const fetchCart = async () => {
      const items = await getCartItems();
      const total = items.reduce(
        (sum: number, item: CartItems) => sum + item.quantity,
        0
      );
      setCartItems(total);
    };

    fetchCart();
  }, [cartItems]);

  const value = {
    cartItems,
    setCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
