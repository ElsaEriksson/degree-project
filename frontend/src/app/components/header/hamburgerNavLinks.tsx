"use client";
import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { User2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useHeader } from "@/app/providers";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { useState } from "react";
import FadeStaggerCircles from "./fadeStaggerCircles";

const links = [
  { name: "Home", href: "/", icon: HomeIcon },
  {
    name: "Shop All Products",
    href: "/products",
  },
];

const collections = [
  { name: "Howdy", href: "/collection/howdy" },
  { name: "Beigelace", href: "/collection/beigelace" },
  { name: "Colorfur", href: "/collection/colorfur" },
];

export default function HamburgerNavLinks({
  session,
}: {
  session: Session | null;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { setAuthFormOpen, setIsMenuOpen } = useHeader();
  const pathname = usePathname();

  const isLoggedIn = session && session.user;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsMenuOpen(false);
    setIsLoggingOut(false);
  };

  return (
    <>
      {/* Hamburger menu headline and close button */}
      <div className="flex justify-between w-full items-center border-b-2">
        <h2 className="text-xl font-semibold mb-4">Menu</h2>
        <p
          onClick={() => setIsMenuOpen(false)}
          className="text-base mb-4 cursor-pointer hover:underline"
        >
          CLOSE
        </p>
      </div>

      <div className="flex flex-col max-h-screen md:space-y-2 h-full">
        <div>
          {/* Hamburger menu links */}
          {links.map((link) => {
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={clsx(
                  "flex h-[48px] grow items-center gap-2 bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:p-2 md:px-3 uppercase border-gray-200 border-b-2",
                  {
                    "bg-gray-200 text-black": pathname === link.href,
                  }
                )}
              >
                <p>{link.name}</p>
              </Link>
            );
          })}

          {/* Collections dropdown */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem
              value="collections"
              className="border-b-2 border-gray-200"
            >
              <AccordionTrigger
                className={clsx(
                  "w-full flex h-[48px] grow items-center justify-between bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:p-2 md:px-3 uppercase",
                  {
                    "bg-gray-100 text-black":
                      pathname.startsWith("/collection"),
                  }
                )}
              >
                <div className="flex items-center gap-2">
                  <p>Collections</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 pl-8 pt-2">
                  {collections.map((collection) => (
                    <Link
                      onClick={() => setIsMenuOpen(false)}
                      key={collection.name}
                      href={collection.href}
                      className={clsx(
                        "text-sm font-medium hover:text-gray-600 uppercase",
                        {
                          "text-black": pathname === collection.href,
                        }
                      )}
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="flex grow gap-2 flex-col justify-end w-full">
          {/* Profile icon and link */}
          {isLoggedIn && (
            <Link
              href="/profile"
              className=" flex h-[48px] items-center gap-2 bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 lg:hidden border-gray-200 border-t-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <User2 className="w-6" />
              <p className="uppercase">Profile</p>
            </Link>
          )}

          {/* Sign in / register and Sign out buttons */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex h-[48px] items-center gap-2 bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 lg:hidden border-t-2 border-gray-200"
            >
              <div className="uppercase">
                {isLoggingOut ? (
                  <FadeStaggerCircles color={"#000000"} />
                ) : (
                  "Sign Out"
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthFormOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex h-[48px] items-center gap-2 bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 lg:hidden border-t-2 border-gray-200"
            >
              <span className="uppercase">Sign in / Register</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
