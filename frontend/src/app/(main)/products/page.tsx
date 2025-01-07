import { Suspense } from "react";
import Pagination from "../../components/pagination";
import ProductCard from "../../components/plp/productCard";
import { fetchProductVariantsFromDatabase } from "../../lib/data";
import { ProductWithVariants } from "../../models/Product";
import { HoverProvider } from "../../providers";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Products(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const currentPage = Number((await props.searchParams).page) || 1;

  const data = await fetchProductVariantsFromDatabase(currentPage);

  if (!data || data.products.length === 0) {
    return <div className="text-center text-gray-500">No products found</div>;
  }

  return (
    <>
      <div className="relative mx-2 md:mx-6 pt-28 flex flex-col gap-4">
        <p className=" uppercase text-[40px] md:text-[70px] lg:text-[100px]">
          All Products
        </p>
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
