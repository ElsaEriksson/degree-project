"use client";
import { useCart, useHeader } from "@/app/providers";
import RemoveCartItem from "./removeCartItem";
import UpdateCartItem from "./updateCartItem";
import Image from "next/image";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function CartItem() {
  const { cartItems, loading } = useCart();
  const { setIsCartOpen } = useHeader();
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <>
      <div className="p-4 flex flex-col h-full max-h-screen">
        <div className="flex justify-between w-full items-center border-b-2">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          <p
            onClick={() => setIsCartOpen(false)}
            className="mb-4 cursor-pointer hover:underline"
          >
            CLOSE
          </p>
        </div>

        <ScrollArea className="flex-grow overflow-y-auto scrollbar-hide">
          {cartItems.map((item) => (
            <div key={item.cart_item_id}>
              <div className="flex py-2">
                <div className="relative">
                  <Image
                    src={item.main_image}
                    alt={item.name}
                    width={75}
                    height={100}
                    className="w-full h-auto transition-opacity duration-300"
                    priority
                  />
                </div>
                <div className="pl-3 w-full flex flex-col justify-between">
                  <div className="grid grid-cols-[1fr_auto]">
                    <div className="flex flex-col">
                      <h3 className="uppercase font-semibold text-base">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                    </div>
                    <RemoveCartItem
                      cart_item_id={item.cart_item_id}
                    ></RemoveCartItem>
                  </div>
                  <div className="flex">
                    <UpdateCartItem item={item}></UpdateCartItem>{" "}
                    <p className="font-semibold">${item.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="w-full border-t-2 mt-2">
          <div className="grid grid grid-cols-[1fr_auto] w-full py-4">
            <p className="font-semibold">TOTAL</p>
            <p className="font-semibold">${totalPrice}</p>
          </div>
          <button className="h-12 w-full bg-black text-white">Checkout</button>
        </div>
      </div>
    </>
  );
}
