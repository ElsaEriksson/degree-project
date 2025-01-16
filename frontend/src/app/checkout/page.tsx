import PaymentFormWrapper from "../components/checkout/paymentFormWrapper";
import { getCartItems } from "../lib/actions/shoppingCart";
import { auth } from "@/auth";
import { CartItems } from "../lib/definitions";
import ItemsInCart from "../components/cart/itemsInCart";

export default async function Checkout() {
  const cartItems: CartItems[] = await getCartItems();
  const session = await auth();

  const isCartEmpty = !cartItems || cartItems.length === 0;

  const deliveryCost = isCartEmpty ? 0.0 : 5.0;
  const itemsTotalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalPrice = itemsTotalPrice + deliveryCost;

  return (
    <div className="m-auto pb-10 pt-16">
      {/* Renders the list of items in the cart */}
      <div className="uppercase text-xl tracking-wide	pb-4">
        Shopping bag items
      </div>
      {isCartEmpty ? (
        <p className="py-4">Your cart is empty.</p>
      ) : (
        <ItemsInCart cartItems={cartItems} session={session} />
      )}
      <div className="border border-1 mb-2 mt-6"></div>
      {/* Order summary */}
      <div className="uppercase pt-2 pb-2 text-xl tracking-wide	">
        Order Summery
      </div>
      <div className="grid grid grid-cols-[1fr_auto] w-full py-1">
        <p className="font-normal text-base">SHIPPING</p>
        <p className="font-normal text-base">${deliveryCost}.00</p>
      </div>
      <div className="grid grid grid-cols-[1fr_auto] w-full pt-1 pb-3">
        <p className="font-normal">TOTAL</p>
        <p className="font-normal">${totalPrice}.00</p>
      </div>
      <div className="border border-1 my-2"></div>
      {/* Wrapper for payment form section */}
      {isCartEmpty ? (
        ""
      ) : (
        <PaymentFormWrapper
          cartItems={cartItems}
          totalPrice={totalPrice}
          session={session}
        ></PaymentFormWrapper>
      )}
    </div>
  );
}
