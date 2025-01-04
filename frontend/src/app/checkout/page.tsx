import { getCartItems } from "../lib/actions";
import { CartItems } from "../models/Cart";
import CheckoutFormWrapper from "../components/checkout/checkoutFormWrapper";

export default async function Checkout() {
  const cartItems: CartItems[] = await getCartItems();

  return (
    <>
      <div>Shopping bag items</div>
      <div>Order Summery</div>
      <div>Payment</div>
      <CheckoutFormWrapper cartItems={cartItems}></CheckoutFormWrapper>
    </>
  );
}
