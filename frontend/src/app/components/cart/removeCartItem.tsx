"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTransition } from "react";
import {
  removeCartItem,
  updateCookieCart,
} from "@/app/lib/actions/shoppingCart";
import { Session } from "next-auth";
import { CartItems } from "@/app/lib/definitions";

export default function RemoveCartItem({
  cart_item_id,
  cartItems,
  session,
}: {
  cart_item_id: number;
  cartItems: CartItems[];
  session: Session | null;
}) {
  const [isPending, startTransition] = useTransition();

  const isLoggedIn = session && session.user;

  const handleRemove = () => {
    startTransition(async () => {
      if (isLoggedIn) {
        await removeCartItem(cart_item_id);
      } else {
        const updatedCart = cartItems.filter(
          (item) => item.cart_item_id !== cart_item_id
        );
        await updateCookieCart(updatedCart);
      }
    });
  };

  return (
    <>
      <button
        onClick={handleRemove}
        disabled={isPending}
        className="flex items-start pt-0.5"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </>
  );
}
