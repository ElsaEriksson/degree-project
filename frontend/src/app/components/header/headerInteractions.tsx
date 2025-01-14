"use client";
import { RotatingBanner } from "./rotatingBanner";
import { Heart, Menu, ShoppingBag, User2 } from "lucide-react";
import { CounterBadge } from "./counterBadge";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useHeader } from "@/app/providers";
import { useRouter } from "next/navigation";
import FadeStaggerCircles from "./fadeStaggerCircles";
import ScrollMode from "./scrollMode";
import Link from "next/link";
import { Session } from "next-auth";

export default function HeaderInteractions({
  favoritesCount,
  cartItemsCount,
  session,
}: {
  favoritesCount: number;
  cartItemsCount: number;
  session: Session | null;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setAuthFormOpen, setIsCartOpen, setIsMenuOpen } = useHeader();
  const router = useRouter();

  const isLoggedIn = session && session.user;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
  };

  return (
    <>
      <ScrollMode>
        <RotatingBanner />

        <div className="h-16 px-2 md:px-4 grid grid-cols-3 items-center border-b">
          {/* Hamburger menu button and icon */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full text-left w-max"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Header logo */}
          <Link href="/" className="text-xl font-medium text-center relative">
            H&H
          </Link>

          <div className="flex items-center justify-end gap-4 text-right">
            {/* Sign in / register and sign out buttons */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg px-6 py-3 hidden lg:block transition-colors hover:underline tracking-widest"
              >
                <div className="uppercase font-inconsolata text-black text-base">
                  {isLoggingOut ? <FadeStaggerCircles /> : "Sign Out"}
                </div>
              </button>
            ) : (
              <button
                onClick={() => setAuthFormOpen(true)}
                className="rounded-lg px-6 text-base font-medium text-black transition-colors hover:underline hidden lg:block tracking-widest"
              >
                <div className="uppercase font-inconsolata">
                  {"Sign in / Register"}
                </div>
              </button>
            )}

            {/* Favorites icon and counter */}
            <button
              onClick={() => router.push("/favorites")}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <Heart className="h-6 w-6" />
              <CounterBadge count={favoritesCount} />
            </button>

            {/* Profile icon */}
            {isLoggedIn && (
              <button
                className="p-2 hidden hover:bg-gray-100 rounded-full lg:block"
                onClick={() => router.push("/profile")}
                aria-label={session.user.email}
                title={session.user.email}
              >
                <User2 className="h-6 w-6" />
              </button>
            )}

            {/* Cart icon and counter */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingBag className="h-6 w-6" />
              <CounterBadge count={cartItemsCount} />
            </button>
          </div>
        </div>
      </ScrollMode>
    </>
  );
}
