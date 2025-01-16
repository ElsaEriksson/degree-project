import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function CheckoutHeader() {
  return (
    <>
      <header>
        <div className="h-16 px-4 flex justify-between items-center border-b fixed top-0 left-0 right-0 z-30 bg-white">
          <Link href="/" className="text-2xl font-bold text-center">
            H&H
          </Link>
          <div className="flex gap-1">
            <Link href="/" className="text-base font-semibold flex gap-1">
              <ArrowLeftIcon></ArrowLeftIcon>
              Back to shopping
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
