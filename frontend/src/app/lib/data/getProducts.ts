import { ProductWithVariants } from "@/app/models/Product";

export async function fetchProductWithProductId(
  product_id: string
): Promise<ProductWithVariants | undefined> {
  try {
    const res = await fetch(
      `http://localhost:5000/api/products/product-with-variants/${product_id}`,
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
    const res = await fetch(
      `http://localhost:5000/api/products/featured-products`,
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

export async function fetchProductsWithCollectionId(
  collection_id: number
): Promise<ProductWithVariants[] | undefined> {
  try {
    const res = await fetch(
      `http://localhost:5000/api/products/collection-product-with-variants/${collection_id}`,
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
      `http://localhost:5000/api/collections/collection-product-with-variants/${collection_name}?query=${query}`,
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
      `http://localhost:5000/api/products/variants-with-product-info?page=${page}&query=${query}`,
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