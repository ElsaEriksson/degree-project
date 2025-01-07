"use client";
import { ProductWithVariants } from "@/app/models/Product";
import { HoverProvider } from "@/app/providers";
import ProductCard from "../plp/productCard";
import { useEffect, useRef } from "react";

export default function ScrollableProductList({
  collectionProducts,
}: {
  collectionProducts: ProductWithVariants[];
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 768) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="mt-5 w-full overflow-x-scroll" ref={scrollContainerRef}>
      <div className="flex">
        {collectionProducts.map((product: ProductWithVariants) => (
          <div
            key={product.product_id}
            className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%] pb-4 md:pb-5 lg:pb-8"
          >
            <HoverProvider>
              <ProductCard product={product} />
            </HoverProvider>
          </div>
        ))}
      </div>
    </div>
  );
}
