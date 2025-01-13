import { ProductWithVariants } from "@/app/models/Product";

const BACKEND_URL = process.env.BACKEND_URL;

export async function fetchProductWithProductId(
  product_id: string
): Promise<ProductWithVariants | undefined> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/product-with-variants/${product_id}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: ProductWithVariants = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined;
  }
}

export async function fetchFeaturedProducts(): Promise<
  ProductWithVariants[] | undefined
> {
  try {
    const res = await fetch(`${BACKEND_URL}/featured-products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data: ProductWithVariants[] = await res.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    return undefined;
  }
}

export async function fetchProductsWithCollectionId(
  collection_id: number
): Promise<ProductWithVariants[] | undefined> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/products-with-variants-by-collection-id/${collection_id}`,
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
    return undefined;
  }
}

export async function fetchProductsByCollectionName(
  collection_name: string,
  query: string
): Promise<
  | {
      products: ProductWithVariants[];
      totalProducts: number;
    }
  | undefined
> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/products-with-variants-by-collection-name/${collection_name}?query=${query}`,
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

export async function fetchProducts(
  page: number = 1,
  query: string
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
      `${BACKEND_URL}/products-with-variants?page=${page}&query=${query}`,
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

export async function fetchFavoriteProducts(
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
      `${BACKEND_URL}/favorite-products-with-variants?page=${page}&favoriteIds=${favoriteIds}`,
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
