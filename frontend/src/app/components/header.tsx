"use client";

import { useState, useEffect } from "react";
import { Menu, Heart, ShoppingBag, User2 } from "lucide-react";
import { RotatingBanner } from "./rotatingBanner";
import { CounterBadge } from "./counterBadge";
import { cn } from "../utils/utils";
import { SlidingPanel } from "./slidingPanel";
import AuthFormSwitcher from "./authFormSwitcher";
import { ModestUser } from "../models/User";
import { logOut } from "../lib/actions";

export function Header({ user }: { user: ModestUser | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const favoritesCount = 2;
  const cartCount = 3;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-30 transition-colors duration-300",
          isScrolled || !isHomePage ? "bg-white" : "bg-transparent"
        )}
      >
        <RotatingBanner />
        <div className="h-16 px-4 flex items-center justify-between border-b">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Menu className="h-6 w-6" />
          </button>

          <a href="/" className="text-2xl font-bold">
            H&H
          </a>

          <div className="flex items-center gap-4">
            {user && user ? (
              <button
                onClick={() => logOut()}
                className="rounded-lg px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-100 md:text-base"
              >
                <span className="uppercase">Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="rounded-lg px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-100 md:text-base"
              >
                <span className="uppercase">Log in / Register</span>
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Heart className="h-6 w-6" />
              <CounterBadge count={favoritesCount} />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User2 className="h-6 w-6" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingBag className="h-6 w-6" />
              <CounterBadge count={cartCount} />
            </button>
          </div>
        </div>
      </header>

      <AuthFormSwitcher
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
      />

      <SlidingPanel
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        side="left"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          {/* Add your menu items here */}
        </div>
      </SlidingPanel>

      <SlidingPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        side="right"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          {/* Add your cart items here */}
        </div>
      </SlidingPanel>
    </>
  );
}
