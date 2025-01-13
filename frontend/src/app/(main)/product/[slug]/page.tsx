import Product from "@/app/components/pdp/product";
import {
  fetchProductsWithCollectionId,
  fetchProductWithProductId,
} from "@/app/lib/data/getProducts";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetails(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const slug = (await props.params).slug || "";
  const productId = slug.split("-")[0];
  const product = await fetchProductWithProductId(productId);

  if (!product) {
    notFound();
  }

  const collectionProducts = await fetchProductsWithCollectionId(
    product.collection_id
  );

  if (!collectionProducts) {
    notFound();
  }

  const updatedCollectionProducts = collectionProducts.filter(
    (p) => p.product_id !== Number(productId)
  );

  return (
    <>
      <div className="mx-6 md:mx-6 pt-28 pb-10">
        <Product
          product={product}
          collectionProducts={updatedCollectionProducts}
        />
      </div>
    </>
  );
}
