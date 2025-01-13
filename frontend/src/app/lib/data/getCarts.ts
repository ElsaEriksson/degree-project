import { CartItems } from "@/app/models/Cart";

export async function fetchActiveCartForUser(
  user_id: number
): Promise<{ cart_id: number }> {
  const res = await fetch(`http://localhost:5000/cart/active-cart/${user_id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      const newCartRes = await fetch(`http://localhost:5000/cart/create-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      });

      if (!newCartRes.ok) {
        throw new Error("Failed to create a new cart");
      }

      return await newCartRes.json();
    }
    throw new Error("Failed to fetch active cart");
  }

  return await res.json();
}

export async function fetchCartItem(
  cart_id: number,
  variant_id: number
): Promise<{ cart_item_id: number; quantity: number } | null> {
  const res = await fetch(
    `http://localhost:5000/cart/cart-items/${cart_id}/${variant_id}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch cart item");
  }
  return await res.json();
}

export async function fetchCartItemsByUserId(
  user_id: number
): Promise<CartItems[] | undefined> {
  try {
    const res = await fetch(
      `http://localhost:5000/cart/cart-items-user/${user_id}`,
      { next: { tags: ["cart"] } }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: CartItems[] = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined;
  }
}
