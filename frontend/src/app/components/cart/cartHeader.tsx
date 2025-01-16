"use client";
import { useHeader } from "@/app/providers";

export default function CartHeader() {
  const { setIsCartOpen } = useHeader();

  return (
    <>
      <div className="flex justify-between w-full items-center border-b-2">
        <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
        <p
          onClick={() => setIsCartOpen(false)}
          className="text-base mb-4 cursor-pointer hover:underline"
        >
          CLOSE
        </p>
      </div>
    </>
  );
}
