import { Suspense } from "react";
import { AnimatedPlpSkeleton } from "@/app/components/skeletons";
import ProductsWrapper from "@/app/components/plp/productsWrapper";

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
  return (
    <>
      <Suspense fallback={<AnimatedPlpSkeleton></AnimatedPlpSkeleton>}>
        <ProductsWrapper
          currentPage={currentPage}
          query={query}
        ></ProductsWrapper>
      </Suspense>
    </>
  );
}
