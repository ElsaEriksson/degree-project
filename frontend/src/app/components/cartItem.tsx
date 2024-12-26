import { cookies } from "next/headers";
import { CartItems } from "../models/Cart";

export default async function CartItem() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get("cart");
  let cart: CartItems[] = cartCookie ? JSON.parse(cartCookie.value) : [];
  return (
    <>
      {cart.map((item) => (
        <p>{item.variant_id}</p>
      ))}
    </>
  );
}
