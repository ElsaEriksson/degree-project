import ProductCard from "@/app/components/plp/productCard";
import SearchProduct from "@/app/components/plp/searchProduct";
import { fetchProductsByCollectionName } from "@/app/lib/data/getProducts";
import { ProductWithVariants } from "@/app/lib/definitions";
import { HoverProvider } from "@/app/providers";
import { SlidersHorizontal } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    query?: string;
  }>;
};

export default async function ProductDetails(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const slug = (await props.params).slug || "";
  const query = (await props.searchParams).query || "";

  const data = await fetchProductsByCollectionName(slug, query);

  const isProductListEmpty = !data || data.products.length === 0;

  return (
    <>
      <div className="relative mx-2 md:mx-6 pb-10 pt-28 flex flex-col gap-5">
        {/* Headline and total number of items  */}
        <div className="flex items-end gap-2 px-1">
          <div className="uppercase text-[38px] md:text-[70px] lg:text-[100px] leading-none">
            {slug}
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
        {isProductListEmpty ? (
          <div className="text-center text-gray-500 mt-10">
            No products found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 w-full">
            {data.products.map((product: ProductWithVariants) => (
              <HoverProvider key={product.product_id}>
                <ProductCard product={product} />
              </HoverProvider>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
