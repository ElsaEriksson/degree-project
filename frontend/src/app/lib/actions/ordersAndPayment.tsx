"use server";
import { auth } from "../../../auth";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { CartItems, OrderData, OrderItem } from "../definitions";

const BACKEND_URL = process.env.BACKEND_URL;

function generateId(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function stripePayment(cartItems: CartItems[]) {
  const res = await fetch(`${BACKEND_URL}/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: cartItems }),
  });

  if (!res.ok) {
    throw new Error("Failed to create payment");
  }

  const data = await res.json();

  if (!data.clientSecret) {
    throw new Error("Server did not return a valid clientSecret");
  }

  return data.clientSecret;
}

async function createOrder(
  orderData: OrderData,
  cart_id: number
): Promise<{ success: boolean; orderId: number }> {
  try {
    const session = await auth();

    if (session) {
      orderData.user_id = session.user.userId;
      orderData.guest_id = null;
      orderData.cart_id = cart_id;
    } else {
      orderData.guest_id = generateId();
      orderData.user_id = null;
      orderData.cart_id = null;
    }

    const response = await fetch(`${BACKEND_URL}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: orderData.user_id,
        guest_id: orderData.guest_id,
        cart_id: orderData.cart_id,
        ...orderData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();

    return { success: data.success, orderId: data.orderId };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order.");
  }
}

async function createOrderItems(
  orderId: number,
  items: OrderItem[]
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch(`${BACKEND_URL}/order-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order_id: orderId, items }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order items");
    }

    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (error) {
    console.error("Error creating order items:", error);
    return { success: false, message: "Failed to create order items" };
  }
}

export async function createOrderWithItems(
  orderData: OrderData,
  items: OrderItem[],
  cart_id: number
) {
  const orderResult = await createOrder(orderData, cart_id);

  if (orderResult.success) {
    const orderItemsResult = await createOrderItems(orderResult.orderId, items);

    if (orderItemsResult.success) {
      revalidatePath("/profile");
      revalidateTag("cart");
      return {
        success: true,
        orderId: orderResult.orderId,
        message: "Order and items created successfully",
      };
    } else {
      return {
        success: false,
        message: "Unable to save order items. Your order might be incomplete.",
      };
    }
  } else {
    return {
      success: false,
      message: "An error occurred while processing your order.",
    };
  }
}
