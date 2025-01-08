"use client";
import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Layers, PowerCircle, User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useHeader } from "@/app/providers";
import HatIcon from "./hatIcon";

const links = [
  { name: "Home", href: "/", icon: HomeIcon },
  {
    name: "Shop All Products",
    href: "/products",
    icon: HatIcon,
  },
];

const collections = [
  { name: "Howdy", href: "/collections/howdy" },
  { name: "Beigelace", href: "/collections/beigelace" },
  { name: "Colorfur", href: "/collections/colorfur" },
];

export default function HamburgerNavLinks() {
  const { setAuthFormOpen, setIsMenuOpen } = useHeader();
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isLoggedIn = status === "authenticated" && session;

  return (
    <>
      <div className="flex flex-col max-h-screen md:space-y-2 h-full">
        <div>
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex h-[48px] grow items-center gap-2 bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:p-2 md:px-3 uppercase border-gray-400 border-t",
                  {
                    "bg-gray-200 text-black": pathname === link.href,
                  }
                )}
              >
                <LinkIcon className="w-6" />
                <p>{link.name}</p>
              </Link>
            );
          })}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="collections" className="border-gray-400">
              <AccordionTrigger
                className={clsx(
                  "w-full flex h-[48px] grow items-center justify-between bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 md:flex-none md:p-2 md:px-3 uppercase border-gray-400 border-t",
                  {
                    "bg-gray-100 text-black":
                      pathname.startsWith("/collections"),
                  }
                )}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-6" />
                  <p>Collections</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 pl-8 pt-2">
                  {collections.map((collection) => (
                    <Link
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
          {isLoggedIn && (
            <Link
              href="/profile"
              className=" flex h-[48px] items-center gap-2 bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 lg:hidden border-gray-400 border-t"
            >
              <User2 className="w-6" />
              <p className="uppercase">Profile</p>
            </Link>
          )}
          {isLoggedIn ? (
            <form
              action={async () => {
                await signOut();
                setIsMenuOpen(false);
              }}
            >
              <button className="w-full flex h-[48px] items-center gap-2 bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 lg:hidden border-t border-gray-400">
                <PowerCircle className="w-6" />
                <div className="uppercase">Sign Out</div>
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setAuthFormOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex h-[48px] items-center gap-2 bg-white p-3 text-sm font-medium hover:bg-gray-100 hover:text-gray-600 lg:hidden border-t border-gray-400"
            >
              <PowerCircle className="w-6" />
              <span className="uppercase">Log in / Register</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
