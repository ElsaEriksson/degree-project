import {
  Collection,
  Product,
  ProductWithVariants,
  Variant,
} from "../models/Product";

export async function fetchVariantsFromDatabase(): Promise<
  Variant[] | undefined
> {
  try {
    const res = await fetch(`http://localhost:5000/api/variants`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: Variant[] = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined; // Hanterar fall där det blir fel
  }
}

export async function fetchProductsFromDatabase(): Promise<
  Product[] | undefined
> {
  try {
    const res = await fetch(`http://localhost:5000/api/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: Product[] = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined; // Hanterar fall där det blir fel
  }
}

export async function fetchCollectionsFromDatabase(): Promise<
  Collection[] | undefined
> {
  try {
    const res = await fetch(`http://localhost:5000/api/collections`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: Collection[] = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined; // Hanterar fall där det blir fel
  }
}

export async function fetchActiveCartForUser(
  userId: number
): Promise<number | null> {
  const res = await fetch(
    `http://localhost:5000/api/carts/active?user_id=${userId}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch active cart");
  }

  return await res.json();
}

export async function fetchCartItem(
  cartId: number,
  variantId: number
): Promise<{ cart_item_id: number; quantity: number } | null> {
  const res = await fetch(
    `http://localhost:5000/api/cart-items?cart_id=${cartId}&variant_id=${variantId}`,
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

export async function fetchProductVariantsFromDatabase(): Promise<
  ProductWithVariants[] | undefined
> {
  try {
    const res = await fetch(
      `http://localhost:5000/api/products/variants-with-product-info`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: ProductWithVariants[] = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined; // Hanterar fall där det blir fel
  }
}
