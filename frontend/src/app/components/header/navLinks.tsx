"use client";
import { HomeIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Layers, PowerCircle, User2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { logOut } from "@/app/lib/actions";

const links = [
  { name: "Home", href: "/", icon: HomeIcon },
  {
    name: "All Products",
    href: "/products",
    icon: DocumentDuplicateIcon,
  },
];

const collections = [
  { name: "Howdy", href: "/collections/howdy" },
  { name: "Beigelace", href: "/collections/beigelace" },
  { name: "Colorfur", href: "/collections/colorfur" },
];

export default function NavLinks({
  openAuthForm,
  closeMenu,
}: {
  openAuthForm: () => void;
  closeMenu: () => void;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isLoggedIn = status === "authenticated" && session;

  return (
    <>
      <div className="flex grow flex-col justify-between md:space-y-2 h-full">
        <div>
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "flex h-[48px] grow items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:p-2 md:px-3",
                  {
                    "bg-sky-100 text-blue-600": pathname === link.href,
                  }
                )}
              >
                <LinkIcon className="w-6" />
                <p>{link.name}</p>
              </Link>
            );
          })}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="collections">
              <AccordionTrigger
                className={clsx(
                  "w-full flex h-[48px] grow items-center justify-between rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:p-2 md:px-3",
                  {
                    "bg-sky-100 text-blue-600":
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
                        "text-sm font-medium hover:text-blue-600",
                        {
                          "text-blue-600": pathname === collection.href,
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
              className=" flex h-[48px] items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 lg:hidden"
            >
              <User2 className="w-6" />
              <p className="uppercase">Profile</p>
            </Link>
          )}
          {isLoggedIn ? (
            <form
              action={async () => {
                await logOut();
                closeMenu();
              }}
            >
              <button className="w-full flex h-[48px] items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 lg:hidden">
                <PowerCircle className="w-6" />
                <div className="uppercase">Sign Out</div>
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                openAuthForm();
                closeMenu();
              }}
              className="w-full flex h-[48px] items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 lg:hidden"
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
