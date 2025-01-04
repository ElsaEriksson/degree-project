import { CartItems } from "../models/Cart";
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
    return undefined;
  }
}

export async function fetchVariantFromDatabase(
  variant_id: number
): Promise<Variant | undefined> {
  try {
    const res = await fetch(
      `http://localhost:5000/api/variants/${variant_id}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: Variant = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined;
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
    return undefined;
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
    return undefined;
  }
}

export async function fetchActiveCartForUser(
  user_id: number
): Promise<{ cart_id: number } | null> {
  const res = await fetch(`http://localhost:5000/api/carts/active/${user_id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
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
    `http://localhost:5000/api/carts/cart-items/${cart_id}/${variant_id}`,
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

export async function fetchProductVariantsFromDatabase(
  page: number = 1
): Promise<
  | {
      products: ProductWithVariants[];
      currentPage: number;
      totalPages: number;
      totalProducts: number;
    }
  | undefined
> {
  try {
    const res = await fetch(
      `http://localhost:5000/api/products/variants-with-product-info?page=${page}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined;
  }
}

export async function fetchCartItemsForUser(
  user_id: number
): Promise<CartItems[] | undefined> {
  try {
    const res = await fetch(
      `http://localhost:5000/api/carts/cart-items/${user_id}`,
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

export async function fetchFavoritesWithProductVariantsFromDatabase(
  page: number = 1,
  favoriteIds: string = ""
): Promise<
  | {
      products: ProductWithVariants[];
      currentPage: number;
      totalPages: number;
      totalProducts: number;
    }
  | undefined
> {
  try {
    const res = await fetch(
      `http://localhost:5000/api/products/favorite-variants-with-product-info?page=${page}&favoriteIds=${favoriteIds}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined;
  }
}
