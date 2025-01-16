import {
  fetchFeaturedProducts,
  fetchProductsWithCollectionId,
} from "../lib/data/getProducts";
import { ProductWithVariants } from "../lib/definitions";
import HorizontalProductList from "./horizontalProductList";

export default async function HorizontalProductListWrapper({
  product,
}: {
  product?: ProductWithVariants;
}) {
  const products = product
    ? await fetchProductsWithCollectionId(product.collection_id)
    : await fetchFeaturedProducts();

  const isProductListEmpty = !products || products.length === 0;

  return (
    <>
      {isProductListEmpty ? (
        <div className="text-center text-gray-500 mt-10">
          No products found.
        </div>
      ) : (
        <HorizontalProductList products={products} />
      )}
    </>
  );
}
