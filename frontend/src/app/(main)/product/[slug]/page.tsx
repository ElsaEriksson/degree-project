import Product from "@/app/components/pdp/product";
import { AnimatedProductDetailsSkeleton } from "@/app/components/skeletons";
import { Suspense } from "react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetails(
  props: Readonly<PageProps>
): Promise<React.ReactElement> {
  const slug = (await props.params).slug || "";
  const productId = slug.split("-")[0];

  return (
    <>
      <div className="mx-6 md:mx-6 pt-28 pb-10">
        <Suspense fallback={<AnimatedProductDetailsSkeleton />}>
          <Product productId={productId} />
        </Suspense>
      </div>
    </>
  );
}
