"use client";
import { ProductWithVariants } from "@/app/models/Product";
import { useHover } from "@/app/providers";
import Image from "next/image";

export default function ProductImage({
  product,
}: {
  product: ProductWithVariants;
}) {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover();

  return (
    <>
      <div
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        <Image
          src={
            isHovered && product.additional_image
              ? product.additional_image
              : product.main_image
          }
          alt={product.name}
          width={300}
          height={400}
          className="w-full h-auto transition-opacity duration-300"
          priority
        />
      </div>
    </>
  );
}
