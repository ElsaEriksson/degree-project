"use client";
import { cn } from "@/app/utils/utils";
import { RotatingBanner } from "./rotatingBanner";
import { Heart, Menu, ShoppingBag, User2 } from "lucide-react";
import { CounterBadge } from "./counterBadge";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { logOut } from "@/app/lib/actions";
import { useCart, useHeader } from "@/app/providers";
import { usePathname } from "next/navigation";
import FadeStaggerCircles from "./fadeStaggerCircles";

export default function HeaderInteractions() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const { setAuthFormOpen, setIsCartOpen, setIsMenuOpen } = useHeader();
  const { cartItems } = useCart();
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated" && session;

  const favoritesCount = 2;
  const cartCount = 3;
  console.log(cartItems);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsHomePage(pathname === "/");
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const result = await logOut();
    if (!result.success) {
      console.error(result.error);
    }
    setIsLoggingOut(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      console.log("User is logged in:", session);
    } else {
      console.log("User is not logged in");
    }
  }, [status, session]);

  return (
    <>
      <div
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
              <form onSubmit={handleLogout}>
                <button
                  disabled={isLoggingOut}
                  className="rounded-lg px-6 py-3 hidden lg:block text-sm font-medium text-black transition-colors hover:underline md:text-base"
                >
                  <div className="uppercase">
                    {isLoggingOut ? <FadeStaggerCircles /> : "Sign Out"}
                  </div>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setAuthFormOpen(true)}
                disabled={status === "loading"}
                className="rounded-lg px-6 text-sm font-medium text-black transition-colors hover:underline md:text-base hidden lg:block"
              >
                <div className="uppercase">
                  {status === "loading" ? (
                    <FadeStaggerCircles />
                  ) : (
                    "Sign in / Register"
                  )}
                </div>
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Heart className="h-6 w-6" />
              <CounterBadge count={favoritesCount} />
            </button>

            {isLoggedIn && (
              <button
                className="p-2 hidden hover:bg-gray-100 rounded-full lg:block"
                aria-label={session.user.email}
                title={session.user.email}
              >
                <User2 className="h-6 w-6" />
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingBag className="h-6 w-6" />
              <CounterBadge count={cartItems} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
