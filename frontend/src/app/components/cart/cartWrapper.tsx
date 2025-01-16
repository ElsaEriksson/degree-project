import { getCartItems } from "@/app/lib/actions/shoppingCart";
import { CartItems } from "@/app/lib/definitions";
import { auth } from "@/auth";
import Cart from "./cart";

export default async function CartWrapper() {
  const cartItems: CartItems[] = await getCartItems();
  const session = await auth();

  return (
    <>
      <Cart cartItems={cartItems} session={session} />
    </>
  );
}
