import Link from "next/link";
import { Button } from "./ui/button";
import { Instagram } from "lucide-react";
import { AtSymbolIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <>
      <footer className="w-full px-6 py-12 border-t-2">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Company Info */}
            <div className="max-w-sm">
              <p className="text-base">
                Handcrafted Hats is fashion brand founded in 2015 by Jane Doe.
                All of our pieces is thoughtfully designed and handcrafted in
                Los Angeles.
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="grid gap-2 text-base">
              <Link href="/store" className="hover:underline">
                Store
              </Link>
              <Link href="/our-story" className="hover:underline">
                About
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
              <Link href="/press" className="hover:underline">
                Press
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </nav>

            {/* Newsletter Signup */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-normal">
                Sign up & receive 10% off your first order
              </h3>
              <div className="grid gap-4">
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                  />
                  <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>

                <Button className="rounded-full border-2 hover:bg-black hover:text-white transition-colors">
                  SUBSCRIBE
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-12 flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <Link href="https://instagram.com" className="hover:opacity-70">
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Follow us on Instagram</span>
            </Link>
            <p className="text-sm">© 2025 - handcraftedhats.com</p>
          </div>
        </div>
      </footer>
    </>
  );
}
