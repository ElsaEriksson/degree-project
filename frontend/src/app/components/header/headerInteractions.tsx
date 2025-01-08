"use client";
import { RotatingBanner } from "./rotatingBanner";
import { Heart, Menu, ShoppingBag, User2 } from "lucide-react";
import { CounterBadge } from "./counterBadge";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useHeader } from "@/app/providers";
import { useRouter } from "next/navigation";
import FadeStaggerCircles from "./fadeStaggerCircles";
import ScrollMode from "./scrollMode";

export default function HeaderInteractions({
  favoritesCount,
  cartItemsCount,
}: {
  favoritesCount: number;
  cartItemsCount: number;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setAuthFormOpen, setIsCartOpen, setIsMenuOpen } = useHeader();
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoggedIn = status === "authenticated" && session;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
  };

  return (
    <>
      <ScrollMode>
        <RotatingBanner />
        <div className="h-16 px-4 grid grid-cols-3 items-center border-b">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full text-left w-max"
          >
            <Menu className="h-6 w-6" />
          </button>

          <a href="/" className="text-xl font-medium text-center">
            H&H
          </a>

          <div className="flex items-center justify-end gap-4 text-right">
            {isLoggedIn ? (
              <form onSubmit={handleLogout}>
                <button
                  disabled={isLoggingOut}
                  className="rounded-lg px-6 py-3 hidden lg:block transition-colors hover:underline tracking-widest"
                >
                  <div className="uppercase font-inconsolata text-black text-base">
                    {isLoggingOut ? <FadeStaggerCircles /> : "Sign Out"}
                  </div>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setAuthFormOpen(true)}
                disabled={status === "loading"}
                className="rounded-lg px-6 text-base font-medium text-black transition-colors hover:underline hidden lg:block tracking-widest"
              >
                <div className="uppercase font-inconsolata">
                  {status === "loading" ? (
                    <FadeStaggerCircles />
                  ) : (
                    "Sign in / Register"
                  )}
                </div>
              </button>
            )}
            <button
              onClick={() => router.push("/favorites")}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <Heart className="h-6 w-6" />
              <CounterBadge count={favoritesCount} />
            </button>

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
