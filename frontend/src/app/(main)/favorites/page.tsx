import { cookies } from "next/headers";
import ProductCard from "../../components/plp/productCard";
import { Suspense } from "react";
import { ProductWithVariants } from "@/app/models/Product";
import Pagination from "../../components/pagination";
import { fetchFavoritesWithProductVariantsFromDatabase } from "../../lib/data";
import { HoverProvider } from "../../providers";

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Favorites(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const currentPage = Number((await props.searchParams).page) || 1;

  const cookieStore = await cookies();
  const favorites = cookieStore.get("favorites");
  let favoritesArray = "";
  if (favorites?.value) {
    favoritesArray = JSON.parse(favorites?.value).toString() ?? "";
  }

  const data = await fetchFavoritesWithProductVariantsFromDatabase(
    currentPage,
    favoritesArray
  );

  if (!data) {
    return <div>Error loading products</div>;
  }

  const { products, totalPages } = data;

  if (products.length === 0) {
    return (
      <div className="relative mx-6 mt-20 pt-10">
        <div>No favorites saved</div>
      </div>
    );
  }

  return (
    <>
      <div className="relative mx-6 pt-28">
        <p className=" uppercase text-[40px] md:text-[70px] lg:text-[100px]">
          Favorites
        </p>{" "}
        <Suspense fallback={"loading..."}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 w-full">
            {products.map((product: ProductWithVariants) => (
              <HoverProvider key={product.product_id}>
                <ProductCard product={product} />
              </HoverProvider>
            ))}
          </div>
        </Suspense>
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
