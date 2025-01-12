import { getCartItems } from "../lib/actions";
import { CartItems } from "../models/Cart";
import ItemsInCart from "../components/cart/itemsInCart";
import PaymentFormWrapper from "../components/checkout/paymentFormWrapper";

export default async function Checkout() {
  const cartItems: CartItems[] = await getCartItems();

  const deliveryCost = 5.0;
  const itemsTotalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalPrice = itemsTotalPrice + deliveryCost;

  return (
    <div className="m-auto pb-10 pt-16">
      <div className="uppercase text-xl tracking-wide	pb-4">
        Shopping bag items
      </div>
      <ItemsInCart cartItems={cartItems}></ItemsInCart>
      <div className="border border-1 mb-2 mt-6"></div>
      <div className="uppercase pt-2 pb-2 text-xl tracking-wide	">
        Order Summery
      </div>
      <div className="grid grid grid-cols-[1fr_auto] w-full py-1">
        <p className="font-normal text-base">SHIPPING</p>
        <p className="font-normal text-base">$5</p>
      </div>
      <div className="grid grid grid-cols-[1fr_auto] w-full pt-1 pb-3">
        <p className="font-normal">TOTAL</p>
        <p className="font-normal">${totalPrice}</p>
      </div>
      <div className="border border-1 my-2"></div>
      <PaymentFormWrapper
        cartItems={cartItems}
        totalPrice={totalPrice}
      ></PaymentFormWrapper>
    </div>
  );
}
