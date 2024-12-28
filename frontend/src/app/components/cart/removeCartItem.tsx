"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeCartItem, updateCookieCart } from "../../lib/actions";
import { useTransition } from "react";
import { CartItems } from "../../models/Cart";
import { useSession } from "next-auth/react";
import { useCart } from "@/app/providers";

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
  const { setCartItems } = useCart();
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated" && session;

  const handleRemove = () => {
    startTransition(async () => {
      if (isLoggedIn) {
        if (cart_item_id) {
          const result = await removeCartItem(cart_item_id);

          if (result.success) {
            const updatedCart = cart.filter(
              (item) => item.cart_item_id !== cart_item_id
            );

            setCart(updatedCart);
            setCartItems(
              updatedCart.reduce((total, item) => total + item.quantity, 0)
            );
          } else {
            console.error(result.message);
          }
        }
      } else {
        const updatedCart = cart.filter(
          (item) => item.cart_item_id !== cart_item_id
        );

        setCart(updatedCart);
        await updateCookieCart(updatedCart);
        setCartItems(
          updatedCart.reduce((total, item) => total + item.quantity, 0)
        );
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
