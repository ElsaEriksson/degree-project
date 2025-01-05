import { getCartItems } from "../lib/actions";
import { CartItems } from "../models/Cart";
import ItemsInCart from "../components/cart/itemsInCart";
import PaymentFormWrapper from "../components/checkout/paymentFormWrapper";
import CheckoutForm from "../components/checkout/checkoutForm";

export default async function Checkout() {
  const cartItems: CartItems[] = await getCartItems();

  const deliveryCost = 5.0;
  const itemsTotalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalPrice = itemsTotalPrice + deliveryCost;

  return (
    <div className="m-auto py-4">
      <div className="uppercase text-xl tracking-wide	pb-4">
        Shopping bag items
      </div>
      <ItemsInCart cartItems={cartItems}></ItemsInCart>
      <div className="border border-1 mb-2 mt-6"></div>
      <div className="uppercase pt-2 pb-2 text-xl tracking-wide	">
        Order Summery
      </div>
      <div className="grid grid grid-cols-[1fr_auto] w-full py-1">
        <p className="font-semibold">DELIVERY</p>
        <p className="font-semibold">$5.00</p>
      </div>
      <div className="grid grid grid-cols-[1fr_auto] w-full pt-1 pb-3">
        <p className="font-semibold">TOTAL</p>
        <p className="font-semibold">${totalPrice}</p>
      </div>
      <div className="border border-1 my-2"></div>
      <div className="uppercase pt-2 pb-2 text-xl tracking-wide	">
        Your Information
      </div>
      <CheckoutForm></CheckoutForm>
      <div className="border border-1 mb-2 mt-6"></div>
      <div className="uppercase mt-6 text-xl tracking-wide">Payment</div>
      <PaymentFormWrapper cartItems={cartItems}></PaymentFormWrapper>
    </div>
  );
}