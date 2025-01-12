import { Suspense } from "react";
import Pagination from "../../components/pagination";
import ProductCard from "../../components/plp/productCard";
import { fetchProductVariantsFromDatabase } from "../../lib/data";
import { ProductWithVariants } from "../../models/Product";
import { HoverProvider } from "../../providers";
import { SlidersHorizontal } from "lucide-react";
import SearchProduct from "@/app/components/plp/searchProduct";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
};

export default async function Products(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const query = (await props.searchParams).query || "";
  const currentPage = Number((await props.searchParams).page) || 1;

  const data = await fetchProductVariantsFromDatabase(currentPage, query);

  const isProductListEmpty = data?.products.length === 0;
  const hasProducts = data && data.products.length > 0;

  return (
    <>
      <div className="relative mx-2 md:mx-6 pt-28 flex flex-col gap-5">
        {/* Headline and total number of items  */}
        <div className="flex items-end gap-2 px-1">
          <div className="uppercase text-[38px] md:text-[70px] lg:text-[100px] leading-none">
            All Products
          </div>
          <div className="leading-none pb-1 md:pb-2 lg:pb-3 font-inconsolata text-base md:text-lg">
            {data?.totalProducts || 0} ITEMS
          </div>
        </div>

        {/* Search bar and filter/sort controls */}
        <div className="w-full flex justify-between items-center pt-2 px-1">
          <SearchProduct placeholder="Search products..." />
          <div className="flex gap-2 items-center">
            <SlidersHorizontal className="w-4"></SlidersHorizontal>
            <p className="uppercase text-base">Filter & Sort</p>
          </div>
        </div>

        {/* Product list */}
        <Suspense fallback={"loading..."}>
          {isProductListEmpty ? (
            <div className="text-center text-gray-500 mt-10">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 w-full">
              {hasProducts &&
                data.products.map((product: ProductWithVariants) => (
                  <HoverProvider key={product.product_id}>
                    <ProductCard product={product} />
                  </HoverProvider>
                ))}
            </div>
          )}
        </Suspense>

        {/* Pagination controls */}
        {hasProducts && <Pagination totalPages={data.totalPages} />}
      </div>
    </>
  );
}
