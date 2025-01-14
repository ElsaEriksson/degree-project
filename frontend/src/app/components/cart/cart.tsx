"use client";
import { useHeader } from "@/app/providers";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useRouter } from "next/navigation";
import ItemsInCart from "./itemsInCart";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { CartItems } from "@/app/lib/definitions";

export default function Cart({
  cartItems,
  session,
}: {
  cartItems: CartItems[];
  session: Session | null;
}) {
  const { setIsCartOpen } = useHeader();
  const router = useRouter();
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <>
        <div className="px-4 pt-4 flex justify-between w-full items-center border-b-2">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          <p
            onClick={() => setIsCartOpen(false)}
            className="mb-4 cursor-pointer hover:underline"
          >
            CLOSE
          </p>
        </div>
        <div className="p-4">Your cart is empty.</div>
      </>
    );
  }

  return (
    <>
      <div className="p-4 flex flex-col h-full max-h-screen">
        <div className="flex justify-between w-full items-center border-b-2">
          <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
          <p
            onClick={() => setIsCartOpen(false)}
            className="text-base mb-4 cursor-pointer hover:underline"
          >
            CLOSE
          </p>
        </div>

        <ScrollArea className="flex-grow overflow-y-auto scrollbar-hide">
          <ItemsInCart cartItems={cartItems} session={session} />
        </ScrollArea>

        <div className="w-full border-t-2 mt-2">
          <div className="grid grid grid-cols-[1fr_auto] w-full py-4">
            <p className="font-semibold">TOTAL</p>
            <p className="font-semibold">${totalPrice}</p>
          </div>
          <Button
            onClick={() => router.push("/checkout")}
            className="w-full py-6 text-lg md:text-lg rounded-none flex justify-center bg-black hover:bg-black/90 tracking-wider uppercase"
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
}
