import { CartItems } from "@/app/models/Cart";
import { useCart } from "@/app/providers";
import { useSession } from "next-auth/react";

export default function UpdateCartItem({ item }: { item: CartItems }) {
  const { updateItemQuantity, cartItems, updateItemCookieCart } = useCart();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session;

  const handleUpdateQuantity = async (
    cart_item_id: number,
    quantity: number,
    variantId: number
  ) => {
    if (isLoggedIn) {
      await updateItemQuantity(cart_item_id, quantity);
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

        await updateItemCookieCart(updatedCartItems);
      }
    }
  };
  return (
    <>
      <button
        className="h-6 w-6 border border-black"
        onClick={async () =>
          await handleUpdateQuantity(
            item.cart_item_id,
            item.quantity - 1,
            item.variant_id
          )
        }
      >
        -
      </button>
      <button
        className="h-6 w-6 border border-black"
        onClick={() =>
          handleUpdateQuantity(
            item.cart_item_id,
            item.quantity + 1,
            item.variant_id
          )
        }
      >
        +
      </button>
    </>
  );
}
