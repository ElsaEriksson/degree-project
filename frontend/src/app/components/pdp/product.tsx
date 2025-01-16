import FavoriteIcon from "../plp/favoriteIcon";
import PdpAccordion from "./pdpAccordion";
import ThumbnailsAndMainImage from "./thumbnailsAndMainImage";
import BreadcrumbSwitcher from "./breadcrumbSwitcher";
import Link from "next/link";
import SizeSelection from "./sizeSelections";
import { fetchProductWithProductId } from "@/app/lib/data/getProducts";
import HorizontalProductListWrapper from "../horizontalProductListWrapper";
import { Suspense } from "react";
import { AnimatedProductListingSkeleton } from "../skeletons";

export default async function Product({ productId }: { productId: string }) {
  const product = await fetchProductWithProductId(productId);

  if (!product) {
    return (
      <div className="container mx-auto">
        <p>No product found</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto">
        <BreadcrumbSwitcher product={product}></BreadcrumbSwitcher>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Image gallery */}
          <div className="relative ">
            <ThumbnailsAndMainImage product={product}></ThumbnailsAndMainImage>
          </div>

          {/* Right side - Product details */}
          <div className="space-y-6 flex flex-col justify-between h-full">
            <div className="w-full">
              <Link
                href={`/collection/${product.collection_name?.toLocaleLowerCase()}`}
              >
                <p className="text-base lg:text-lg text-gray-400 tracking-widest font-inconsolata uppercase">
                  {product.collection_name} COLLECTION
                </p>
              </Link>
              <h1 className="text-lg my-1 md:text-[25px] lg:text-[32px] xl:text-[40px] font-medium md:my-2 uppercase leading-tight">
                {product.name}
              </h1>
              <div className="flex justify-between items-center w-full">
                <p className="md:text-lg lg:text-xl font-medium mt-2">
                  ${product.price}.00
                </p>
                <FavoriteIcon productId={product.product_id}></FavoriteIcon>
              </div>
              <p className="text-base xl:text-[15px] text-gray-600 pt-4 md:pt-4 lg:pt-6 xl:pt-8 font-inconsolata">
                {product.description_long}
              </p>
            </div>

            {/* Size selection */}
            <div className="space-y-4 md:space-y-6">
              <SizeSelection product={product}></SizeSelection>
            </div>
          </div>
        </div>
        {/* Product accordion with information */}
        <PdpAccordion product={product}></PdpAccordion>

        <h1 className="text-lg md:text-[25px] lg:text-[32px] xl:text-[40px] font-medium uppercase">
          YOU MAY ALSO LIKE
        </h1>

        {/* Products from the same collection */}
        <Suspense
          fallback={
            <AnimatedProductListingSkeleton></AnimatedProductListingSkeleton>
          }
        >
          <HorizontalProductListWrapper
            product={product}
          ></HorizontalProductListWrapper>
        </Suspense>
      </div>
    </>
  );
}
