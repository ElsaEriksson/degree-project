"use client";
import { useCart } from "@/app/providers";
import RemoveCartItem from "./removeCartItem";
import UpdateCartItem from "./updateCartItem";

export default function CartItem() {
  const { cartItems, loading } = useCart();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <>
      {cartItems.map((item) => (
        <div key={item.cart_item_id}>
          <h3>{item.name}</h3>
          <p>Size: {item.size}</p>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <UpdateCartItem item={item}></UpdateCartItem>
          <RemoveCartItem cart_item_id={item.cart_item_id}></RemoveCartItem>
        </div>
      ))}
    </>
  );
}
