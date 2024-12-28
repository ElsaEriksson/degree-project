"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeCartItem } from "../../lib/actions";
import { useTransition } from "react";
import { CartItems } from "../../models/Cart";

export default function RemoveCartItem({
  cart_item_id,
  setCart,
  cart,
}: {
  cart_item_id: number | undefined;
  setCart: (test: CartItems[]) => void;
  cart: CartItems[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      if (cart_item_id) {
        const result = await removeCartItem(cart_item_id);

        if (result.success) {
          const updatedCart = cart.filter(
            (item) => item.cart_item_id !== cart_item_id
          );

          setCart(updatedCart);
        } else {
          console.error(result.message);
        }
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
