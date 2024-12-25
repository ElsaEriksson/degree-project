"use client";

import { useState, useEffect } from "react";
import { Menu, Heart, ShoppingBag, User2 } from "lucide-react";
import { RotatingBanner } from "./rotatingBanner";
import { CounterBadge } from "../counterBadge";
import { cn } from "../../utils/utils";
import AuthFormSwitcher from "../authFormSwitcher";
import { logOut } from "../../lib/actions";
import { useSession } from "next-auth/react";
import NavLinks from "./navLinks";
import { SlidingPanel } from "./slidingPanel";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const [isAuthFormOpen, setAuthFormOpen] = useState(false);
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated" && session;

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
        <div className="h-16 px-4 grid grid-cols-3 items-center border-b">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full text-left w-max"
          >
            <Menu className="h-6 w-6" />
          </button>

          <a href="/" className="text-2xl font-bold text-center">
            H&H
          </a>

          <div className="flex items-center justify-end gap-4 text-right">
            {isLoggedIn ? (
              <form
                action={async () => {
                  await logOut();
                }}
              >
                <button className="rounded-lg px-6 py-3 hidden lg:block text-sm font-medium text-black transition-colors hover:bg-gray-100 md:text-base">
                  <div className="uppercase">Sign Out</div>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setAuthFormOpen(true)}
                className="rounded-lg px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-100 md:text-base hidden lg:block"
              >
                <span className="uppercase">Log in / Register</span>
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Heart className="h-6 w-6" />
              <CounterBadge count={favoritesCount} />
            </button>

            {isLoggedIn && (
              <button className="p-2 hidden hover:bg-gray-100 rounded-full lg:block">
                <User2 className="h-6 w-6" />
              </button>
            )}

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
        isAuthFormOpen={isAuthFormOpen}
        closeAuthForm={() => setAuthFormOpen(false)}
      />

      <SlidingPanel
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        side="left"
      >
        <div className="p-4 h-full flex grow flex-col justify-between">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <NavLinks
            openAuthForm={() => setAuthFormOpen(true)}
            closeMenu={() => setIsMenuOpen(false)}
          />
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
