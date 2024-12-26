"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState } from "react";

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
