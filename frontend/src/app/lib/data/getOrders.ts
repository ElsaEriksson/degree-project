import { OrderDataFromDatabase } from "../../models/Orders";

const BACKEND_URL = process.env.BACKEND_URL;

export async function fetchOrderByOrderId(
  order_id: string
): Promise<OrderDataFromDatabase | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/order/${order_id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: OrderDataFromDatabase = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined;
  }
}

export async function fetchOrdersByUserId(
  user_id: number
): Promise<OrderDataFromDatabase[] | undefined> {
  try {
    const res = await fetch(`${BACKEND_URL}/orders/${user_id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: OrderDataFromDatabase[] = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined;
  }
}
