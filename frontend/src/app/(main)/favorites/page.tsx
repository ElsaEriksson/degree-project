import ProductCard from "../../components/plp/productCard";
import { Suspense } from "react";
import Pagination from "../../components/pagination";
import { HoverProvider } from "../../providers";
import { fetchFavoriteProducts } from "@/app/lib/data/getProducts";
import { ProductWithVariants } from "@/app/lib/definitions";
import { getFavoritesList } from "@/app/lib/actions/favorites";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Favorites(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const currentPage = Number((await props.searchParams).page) || 1;

  const favoritesArray = await getFavoritesList();

  const data = await fetchFavoriteProducts(currentPage, favoritesArray);

  if (!data) {
    return <div>Error loading products</div>;
  }

  const { products, totalPages } = data;
  const isFavoritesListEmpty = products.length === 0;

  return (
    <>
      <div className="relative px-6 pt-28 min-h-screen">
        <p className="uppercase text-[40px] md:text-[70px] lg:text-[100px] pb-4">
          Favorites
        </p>

        {/* Favorites product list */}
        {isFavoritesListEmpty ? (
          <>
            <div className="text-gray-500 mt-10 pb-28">
              <div>No favorites saved.</div>{" "}
            </div>
          </>
        ) : (
          <>
            <Suspense fallback={"loading..."}>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 w-full">
                {products.map((product: ProductWithVariants) => (
                  <HoverProvider key={product.product_id}>
                    <ProductCard product={product} />
                  </HoverProvider>
                ))}
              </div>
            </Suspense>

            {/* Pagination controls */}
            <Pagination totalPages={totalPages} />
          </>
        )}
      </div>
    </>
  );
}
