"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/app/providers";

export default function RemoveCartItem({
  cart_item_id,
}: {
  cart_item_id: number;
}) {
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();
  const { cartItems, updateItemCookieCart, removeItemFromCart } = useCart();

  const isLoggedIn = status === "authenticated" && session;

  const handleRemove = () => {
    startTransition(async () => {
      if (isLoggedIn) {
        const result = await removeItemFromCart(cart_item_id);
      } else {
        const updatedCart = cartItems.filter(
          (item) => item.cart_item_id !== cart_item_id
        );
        const result = await updateItemCookieCart(updatedCart);
      }
    });
  };

  return (
    <>
      <button onClick={handleRemove} disabled={isPending}>
        <XMarkIcon className="h-5 w-5" />
      </button>
    </>
  );
}
