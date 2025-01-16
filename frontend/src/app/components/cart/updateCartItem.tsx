"use client";
import {
  updateCartItemQuantity,
  updateCookieCart,
} from "@/app/lib/actions/shoppingCart";
import { CartItems } from "@/app/lib/definitions";
import { Minus, Plus } from "lucide-react";
import { Session } from "next-auth";

export default function UpdateCartItem({
  item,
  cartItems,
  session,
}: {
  item: CartItems;
  cartItems: CartItems[];
  session: Session | null;
}) {
  const isLoggedIn = session && session.user;
  const disabledMinusButton = item.quantity === 1;
  const disabledPlusButton = item.quantity > item.stock_quantity;

  const handleUpdateQuantity = async (
    cart_item_id: number,
    quantity: number,
    variantId: number
  ) => {
    if (isLoggedIn) {
      await updateCartItemQuantity(cart_item_id, quantity);
    } else {
      const existingItemIndex = cartItems.findIndex(
        (item) => item.variant_id === variantId
      );

      if (existingItemIndex > -1) {
        const updatedCartItems = [...cartItems];

        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: quantity,
        };

        await updateCookieCart(updatedCartItems);
      }
    }
  };

  return (
    <>
      <div className="flex grow pb-1">
        <button
          className={
            disabledMinusButton
              ? "h-6 w-6 border border-gray-300 flex justify-center items-center rounded-sm"
              : "h-6 w-6 border border-black flex justify-center items-center rounded-sm"
          }
          onClick={async () =>
            await handleUpdateQuantity(
              item.cart_item_id,
              item.quantity - 1,
              item.variant_id
            )
          }
          disabled={disabledMinusButton}
        >
          <Minus
            className={
              disabledMinusButton ? "text-gray-300  w-4" : "text-black w-4"
            }
          ></Minus>
        </button>
        <p className="px-2 text-base">{item.quantity}</p>
        <button
          className={
            disabledPlusButton
              ? "h-6 w-6 border border-gray-300 flex justify-center items-center rounded-sm"
              : "h-6 w-6 border border-black flex justify-center items-center rounded-sm"
          }
          onClick={() =>
            handleUpdateQuantity(
              item.cart_item_id,
              item.quantity + 1,
              item.variant_id
            )
          }
          disabled={disabledPlusButton}
        >
          <Plus
            className={
              disabledPlusButton ? "text-gray-300 w-4" : "text-black w-4"
            }
          ></Plus>
        </button>
      </div>
    </>
  );
}
