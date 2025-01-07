import Product from "@/app/components/pdp/product";
import {
  fetchProductFromDatabaseWithCollectionId,
  fetchProductFromDatabaseWithId,
} from "@/app/lib/data";
import { notFound } from "next/navigation";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export default async function ProductDetails(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const slug = (await props.params).slug || "";
  const productId = slug.split("-")[0];
  const product = await fetchProductFromDatabaseWithId(productId);
  if (!product) {
    notFound();
  }
  const collectionProducts = await fetchProductFromDatabaseWithCollectionId(
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
      <div className="mx-2 md:mx-6 my-20 pt-10">
        <Product
          product={product}
          collectionProducts={updatedCollectionProducts}
        />
      </div>
    </>
  );
}
