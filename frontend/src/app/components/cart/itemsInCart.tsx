"use client";
import Image from "next/image";
import RemoveCartItem from "./removeCartItem";
import UpdateCartItem from "./updateCartItem";
import { CartItems } from "@/app/models/Cart";
import { Session } from "next-auth";

export default function ItemsInCart({
  cartItems,
  session,
}: {
  cartItems: CartItems[];
  session: Session | null;
}) {
  return (
    <>
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
                  <h3 className=" font-normal text-base">{item.name}</h3>
                  <p className="text-base text-gray-600 font-inconsolata">
                    Size: {item.size}
                  </p>
                </div>

                <RemoveCartItem
                  cart_item_id={item.cart_item_id}
                  cartItems={cartItems}
                  session={session}
                ></RemoveCartItem>
              </div>

              <div className="flex">
                <UpdateCartItem
                  cartItems={cartItems}
                  item={item}
                  session={session}
                ></UpdateCartItem>
                <p className="font-medium text-base">${item.price}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
