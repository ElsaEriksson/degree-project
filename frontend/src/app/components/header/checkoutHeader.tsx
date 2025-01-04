import { ArrowLeftIcon } from "lucide-react";

export default function CheckoutHeader() {
  return (
    <>
      <header>
        <div className="h-16 px-4 flex justify-between items-center border-b">
          <a href="/" className="text-2xl font-bold text-center">
            H&H
          </a>
          <div className="flex gap-1">
            <ArrowLeftIcon></ArrowLeftIcon>
            <a href="/" className="text-base font-semibold">
              Back to shopping
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
