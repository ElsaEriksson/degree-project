import { updateCartItemQuantity, updateCookieCart } from "@/app/lib/actions";
import { CartItems } from "@/app/models/Cart";
import { useSession } from "next-auth/react";

export default function UpdateCartItem({
  item,
  cartItems,
}: {
  item: CartItems;
  cartItems: CartItems[];
}) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;
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
              ? "h-6 w-6 border border-gray-300 flex justify-center items-center"
              : "h-6 w-6 border border-black flex justify-center items-center"
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
          <p className={disabledMinusButton ? "text-gray-300" : "text-black"}>
            -
          </p>
        </button>
        <p className="px-2">{item.quantity}</p>
        <button
          className={
            disabledPlusButton
              ? "h-6 w-6 border border-gray-300"
              : "h-6 w-6 border border-black"
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
          <p className={disabledPlusButton ? "text-gray-300" : "text-black"}>
            +
          </p>
        </button>
      </div>
    </>
  );
}
