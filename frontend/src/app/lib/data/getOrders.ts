import { OrderDataFromDatabase } from "../../models/Orders";

export async function fetchOrderByOrderId(
  order_id: string
): Promise<OrderDataFromDatabase | undefined> {
  try {
    const res = await fetch(`http://localhost:5000/order/${order_id}`, {
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
    const res = await fetch(`http://localhost:5000/orders/${user_id}`, {
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
