import { ProductWithVariants } from "@/app/models/Product";
import { cn } from "@/app/utils/utils";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useState } from "react";

export default function ThumbnailsAndMainImage({
  product,
}: {
  product: ProductWithVariants;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { src: product.main_image, alt: "Product view 1", type: "image" },
    { src: product.additional_image, alt: "Product view 2", type: "image" },
    {
      src: product.video,
      alt: "Product video view",
      type: "video",
      poster: product.main_image,
    },
  ];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  return (
    <>
      {/* Thumbnails */}
      <div className="hidden md:flex absolute left-0 top-0 h-full flex-col justify-between w-32">
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
            <img
              src={image.type === "video" ? image.poster : image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {image.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <Play className="w-8 h-8 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      {/* Main image */}
      <div className="relative md:ml-28 md:pl-7">
        {images[currentImageIndex].type === "video" ? (
          <video
            controls
            className="w-full aspect-[3/4] object-cover"
            src={images[currentImageIndex].src}
            poster={images[currentImageIndex].poster}
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
          className="absolute left-4 md:left-11 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
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
                "font-inconsolata text-sm md:text-base lg:text-lg",
                currentImageIndex === index
                  ? "text-white underline"
                  : "text-white"
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}