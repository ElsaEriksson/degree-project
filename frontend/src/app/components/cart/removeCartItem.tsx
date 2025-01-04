"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { removeCartItem, updateCookieCart } from "@/app/lib/actions";
import { CartItems } from "@/app/models/Cart";

export default function RemoveCartItem({
  cart_item_id,
  cartItems,
}: {
  cart_item_id: number;
  cartItems: CartItems[];
}) {
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated" && session;

  const handleRemove = () => {
    startTransition(async () => {
      if (isLoggedIn) {
        const result = await removeCartItem(cart_item_id);
      } else {
        const updatedCart = cartItems.filter(
          (item) => item.cart_item_id !== cart_item_id
        );
        const result = await updateCookieCart(updatedCart);
      }
    });
  };

  return (
    <>
      <button
        onClick={handleRemove}
        disabled={isPending}
        className="flex items-start pt-1"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </>
  );
}
