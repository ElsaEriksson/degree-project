import { Suspense } from "react";
import Pagination from "../components/pagination";
import ProductCard from "../components/plp/productCard";
import { fetchProductVariantsFromDatabase } from "../lib/data";
import { ProductWithVariants } from "../models/Product";

export default async function Products({
  searchParams,
}: {
  searchParams?: {
    // query?: string;
    page?: string;
  };
}) {
  // const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const data = await fetchProductVariantsFromDatabase(currentPage);

  if (!data || data.products.length === 0) {
    return <div className="text-center text-gray-500">No products found</div>;
  }

  return (
    <>
      <div className="container mx-auto p-2">
        <Suspense fallback={"loading..."}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-6">
            {data.products.map((product: ProductWithVariants) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </Suspense>
      </div>
      <Pagination totalPages={data.totalPages} />
    </>
  );
}
