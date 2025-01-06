import Product from "@/app/components/pdp/product";
import { fetchProductFromDatabase } from "@/app/lib/data";
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
  const product = await fetchProductFromDatabase(productId);

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="relative mx-6 mt-20 pt-10">
        <Product product={product} />
      </div>
    </>
  );
}
