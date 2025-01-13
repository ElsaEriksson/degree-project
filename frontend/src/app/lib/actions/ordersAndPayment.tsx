"use server";
import { CartItems } from "@/app/models/Cart";
import { OrderData, OrderItem } from "@/app/models/Orders";
import { auth } from "../../../auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

function generateId(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function stripePayment(cartItems: CartItems[]) {
  const res = await fetch(
    "http://localhost:5000/payment/create-payment-intent",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to create payment");
  }

  const data = await res.json();

  if (!data.clientSecret) {
    throw new Error("Server did not return a valid clientSecret");
  }

  return data.clientSecret;
}

async function createOrder(orderData: OrderData, cart_id: number) {
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

    const response = await fetch(`http://localhost:5000/orders`, {
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

    return { success: true, orderId: data.orderId };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

async function createOrderItems(orderId: number, items: OrderItem[]) {
  try {
    const response = await fetch(`http://localhost:5000/order-items`, {
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
    return { success: true, message: data.message };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    console.error("Error creating order items:", error);
    return { success: false, error: "Failed to create order items" };
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
      return {
        success: true,
        orderId: orderResult.orderId,
        message: "Order and items created successfully",
      };
    } else {
      // If order items creation fails, you might want to handle this case (e.g., delete the created order)
      return { success: false, error: orderItemsResult.error };
    }
  } else {
    return { success: false, error: orderResult.error };
  }
}
