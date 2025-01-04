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
