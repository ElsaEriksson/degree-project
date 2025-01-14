"use client";
import { HoverProvider } from "@/app/providers";
import ProductCard from "./plp/productCard";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ProductWithVariants } from "../lib/definitions";

export default function HorizontalProductList({
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

  const prevButtonDisabled = !canScrollPrev;
  const nextButtonDisabled = !canScrollNext;

  const baseButtonClasses =
    "absolute top-1/2 -translate-y-3/4 p-2 bg-white/80 rounded-full transition-colors h-9 w-9 flex items-center justify-center";
  const prevButtonClasses = `${baseButtonClasses} left-4 ${
    prevButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
  }`;
  const nextButtonClasses = `${baseButtonClasses} right-4 ${
    nextButtonDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white"
  }`;

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
        disabled={prevButtonDisabled}
        className={prevButtonClasses}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        disabled={nextButtonDisabled}
        className={nextButtonClasses}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
