"use client";
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
  const router = useRouter();
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <>
        <p className="py-4">Your cart is empty</p>
      </>
    );
  }

  return (
    <>
      <ScrollArea className="flex-grow overflow-y-auto scrollbar-hide">
        <ItemsInCart cartItems={cartItems} session={session} />
      </ScrollArea>

      <div className="w-full border-t-2 mt-2">
        <div className="grid grid grid-cols-[1fr_auto] w-full py-4">
          <p className="font-semibold">TOTAL</p>
          <p className="font-semibold">${totalPrice}.00</p>
        </div>
        <Button
          onClick={() => router.push("/checkout")}
          className="w-full py-6 text-lg md:text-lg rounded-none flex justify-center bg-black hover:bg-black/90 tracking-wider uppercase"
        >
          Checkout
        </Button>
      </div>
    </>
  );
}
