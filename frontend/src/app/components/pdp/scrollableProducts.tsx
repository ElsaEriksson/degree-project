"use client";
import { ProductWithVariants } from "@/app/models/Product";
import { HoverProvider } from "@/app/providers";
import ProductCard from "../plp/productCard";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function ScrollableProductList({
  products,
}: {
  products: ProductWithVariants[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
      };

      emblaApi.on("select", onSelect);
      onSelect();

      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi]);

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative mt-5 w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product: ProductWithVariants) => (
            <div
              key={product.product_id}
              className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4"
            >
              <HoverProvider>
                <ProductCard product={product} />
              </HoverProvider>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handlePrev}
        disabled={!canScrollPrev}
        className={`absolute left-4 top-1/2 -translate-y-3/4 p-2 bg-white/80 rounded-full transition-colors h-9 w-9 flex items-center justify-center ${
          !canScrollPrev ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
        }`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        disabled={!canScrollNext}
        className={`absolute right-4 top-1/2 -translate-y-3/4 p-2 bg-white/80 rounded-full transition-colors h-9 w-9 flex items-center justify-center ${
          !canScrollNext ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
        }`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
