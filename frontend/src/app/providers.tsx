"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState } from "react";
import React, { useEffect } from "react";
import { getCartItems } from "./lib/actions";
import { Product, Variant } from "./models/Product";
import { CartItems } from "./models/Cart";

interface HeaderContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isAuthFormOpen: boolean;
  setAuthFormOpen: (isOpen: boolean) => void;
  favoritesCount: number;
  cartCount: number;
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
    cartCount,
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

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}

interface CartContextType {
  cartItems: CartItems[];
  addToCart: (product: Product, variant: Variant, quantity: number) => void;
  removeFromCart: (cartItemId: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItems[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const items = await getCartItems();
      setCartItems(items);
    };

    fetchCart();
  }, []); // Hämta varukorgen när komponenten mountas

  const addToCart = (product: Product, variant: Variant, quantity: number) => {
    // Lägg till logik för att lägga till varor i varukorgen
    setCartItems((prevCartItems) => {
      const updatedCart = [...prevCartItems];
      const existingItem = updatedCart.find(
        (item) => item.variant_id === variant.variant_id
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        updatedCart.push({
          product_id: product.product_id,
          variant_id: variant.variant_id,
          name: product.name,
          size: variant.size,
          quantity,
          price: product.price,
          stock_quantity: variant.stock_quantity,
        });
      }
      return updatedCart;
    });
  };

  const removeFromCart = (cartItemId: number) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.cart_item_id !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.cart_item_id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}
