"use client";
import { ProductWithVariants } from "@/app/models/Product";
import { cn } from "@/app/utils/utils";
import { ChevronLeft, ChevronRight, Heart, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export default function Product({ product }: { product: ProductWithVariants }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>();
  const [error, setError] = useState("");

  const images = [
    { src: product.main_image, alt: "Product view 1", type: "image" },
    { src: product.additional_image, alt: "Product view 2", type: "image" },
    { src: product.video, alt: "Product video view", type: "video" },
  ];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    setError("");
    // Add to cart logic here
    console.log("Adding to cart:", { product, selectedSize });
  };

  return (
    <>
      <div className="container px-4 py-8 mx-auto">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8">
          {/* Left side - Image gallery */}
          <div className="relative">
            {/* Thumbnails */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between w-32">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-full aspect-square relative overflow-hidden h-[32%]",
                    "border-2 hover:border-gray-400 transition-colors",
                    currentImageIndex === index
                      ? "border-black"
                      : "border-transparent"
                  )}
                >
                  {image.type === "video" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  ) : null}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative ml-28 pl-7">
              {images[currentImageIndex].type === "video" ? (
                <video
                  controls
                  className="w-full aspect-[3/4] object-cover"
                  src={images[currentImageIndex].src}
                />
              ) : (
                <img
                  src={images[currentImageIndex].src}
                  alt={images[currentImageIndex].alt}
                  className="w-full aspect-[3/4] object-cover"
                />
              )}

              {/* Navigation arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      "text-sm",
                      currentImageIndex === index
                        ? "text-black"
                        : "text-gray-400"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Product details */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{product.collection_id}</p>
                <h1 className="text-2xl font-medium mt-1">{product.name}</h1>
                <p className="text-lg mt-2">{product.price} KR</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600">{product.description_short}</p>

            {/* Size selection */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedSize(variant.size);
                      setError("");
                    }}
                    className={cn(
                      "py-2 px-4 border-2 hover:border-gray-400 transition-colors",
                      selectedSize === variant.size
                        ? "border-black"
                        : "border-gray-200"
                    )}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Add to cart button */}
            <Button
              onClick={handleAddToCart}
              className="w-full py-6 text-lg bg-black hover:bg-black/90"
            >
              ADD TO CART
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
