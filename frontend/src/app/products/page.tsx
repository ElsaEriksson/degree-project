import { Suspense } from "react";
import Pagination from "../components/pagination";
import ProductCard from "../components/plp/productCard";
import { fetchProductVariantsFromDatabase } from "../lib/data";
import { ProductWithVariants } from "../models/Product";
import { HoverProvider } from "../providers";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default async function Products(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const currentPage = Number(await props.searchParams) || 1;

  const data = await fetchProductVariantsFromDatabase(currentPage);

  if (!data || data.products.length === 0) {
    return <div className="text-center text-gray-500">No products found</div>;
  }

  return (
    <>
      <div className="relative mx-6 mt-20 pt-10">
        <h2 className="p-1">All Products</h2>
        <Suspense fallback={"loading..."}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 w-full">
            {data.products.map((product: ProductWithVariants) => (
              <HoverProvider key={product.product_id}>
                <ProductCard product={product} />
              </HoverProvider>
            ))}
          </div>
        </Suspense>
        <Pagination totalPages={data.totalPages} />
      </div>
    </>
  );
}
