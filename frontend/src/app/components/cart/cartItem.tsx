"use client";
import RemoveCartItem from "./removeCartItem";
import { CartItems } from "../../models/Cart";
import { useEffect, useState } from "react";
import { getCartItems } from "../../lib/actions";

export default function CartItem() {
  const [cart, setCart] = useState<CartItems[]>([]);

  useEffect(() => {
    async function fetchCart() {
      const cartItems: CartItems[] = await getCartItems();
      setCart(cartItems || []);
    }
    fetchCart();
  }, []);

  const cartIsEmpty = cart && cart.length === 0;

  const handleSetCart = (updatedCart: CartItems[]) => {
    setCart(updatedCart);
  };

  return (
    <>
      {cartIsEmpty && <p>Your cart is empty</p>}
      {!cartIsEmpty &&
        cart &&
        cart.map((item: CartItems, index: number) => (
          <div key={index}>
            <p>
              {item.variant_id}, {item.size}, {item.product_id}, {item.quantity}
            </p>

            <RemoveCartItem
              cart_item_id={item.cart_item_id}
              setCart={handleSetCart}
              cart={cart}
            ></RemoveCartItem>
          </div>
        ))}
    </>
  );
}
