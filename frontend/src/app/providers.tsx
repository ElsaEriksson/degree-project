"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { CartItems } from "./models/Cart";
import { Product, Variant } from "./models/Product";
import {
  addToCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
  updateCookieCart,
} from "./lib/actions";

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
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthFormOpen, setAuthFormOpen] = useState(false);

  const value = {
    isMenuOpen,
    setIsMenuOpen,
    isCartOpen,
    setIsCartOpen,
    isAuthFormOpen,
    setAuthFormOpen,
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
  cartItems: CartItems[];
  cartCount: number;
  loading: boolean;
  addItemToCart: (
    product: Product,
    variant: Variant,
    quantity: number
  ) => Promise<
    | CartItems[]
    | {
        success: boolean;
        data: {
          cart_item_id: number;
          quantity: number;
        } | null;
      }
    | {
        success: boolean;
        data: CartItems[];
      }
  >;
  removeItemFromCart: (cartItemId: number) => Promise<any>;
  updateItemQuantity: (
    cartItemId: number,
    newQuantity: number
  ) => Promise<void>;
  updateItemCookieCart: (updatedCart: CartItems[]) => Promise<any>;
  getTotalItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItems[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  async function fetchCartItems() {
    setLoading(true);
    const items = await getCartItems();
    setCartItems(items);
    setCartCount(
      items.reduce((total: number, item: CartItems) => total + item.quantity, 0)
    );
    setLoading(false);
    return items;
  }

  async function addItemToCart(
    product: Product,
    variant: Variant,
    quantity: number
  ) {
    const result = await addToCart(product, variant, quantity);
    const items = await fetchCartItems();
    setCartItems(items);
    setCartCount(
      items.reduce((total: number, item: CartItems) => total + item.quantity, 0)
    );
    return result;
  }

  async function removeItemFromCart(cartItemId: number) {
    const result = await removeCartItem(cartItemId);
    const items = await fetchCartItems();
    console.log(items);
    setCartItems(items);
    setCartCount(
      items.reduce((total: number, item: CartItems) => total + item.quantity, 0)
    );
    return result;
  }

  async function updateItemQuantity(cartItemId: number, newQuantity: number) {
    await updateCartItemQuantity(cartItemId, newQuantity);
    const items = await fetchCartItems();
    setCartItems(items);
    setCartCount(
      items.reduce((total: number, item: CartItems) => total + item.quantity, 0)
    );
  }

  async function updateItemCookieCart(updatedCart: CartItems[]) {
    const result = await updateCookieCart(updatedCart);
    const items = await fetchCartItems();
    setCartItems(items);
    setCartCount(
      items.reduce((total: number, item: CartItems) => total + item.quantity, 0)
    );
    return result;
  }

  function getTotalItemsCount() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  const value = {
    cartItems,
    cartCount,
    loading,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    updateItemCookieCart,
    getTotalItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface HoverContextType {
  isHovered: boolean;
  buttonIsHovered: boolean;
  setIsHovered: (value: boolean) => void;
  setButtonIsHovered: (value: boolean) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

const HoverContext = createContext<HoverContextType | undefined>(undefined);

export function HoverProvider({ children }: { children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);
  const [buttonIsHovered, setButtonIsHovered] = useState(false);

  function handleMouseEnter() {
    setTimeout(() => {
      setIsHovered(true);
      setButtonIsHovered(true);
    }, 100);
  }

  function handleMouseLeave() {
    setTimeout(() => {
      setIsHovered(false);
      setButtonIsHovered(false);
    }, 100);
  }

  const value = {
    isHovered,
    buttonIsHovered,
    setIsHovered,
    setButtonIsHovered,
    handleMouseEnter,
    handleMouseLeave,
  };

  return (
    <HoverContext.Provider value={value}>{children}</HoverContext.Provider>
  );
}

export function useHover() {
  const context = useContext(HoverContext);
  if (context === undefined) {
    throw new Error("useHover must be used within a HoverProvider");
  }
  return context;
}
