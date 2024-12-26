"use client";
import { Product, ProductWithVariants } from "@/app/models/Product";
import Image from "next/image";
import { useState } from "react";

export default function ProductCard({
  product,
}: {
  product: ProductWithVariants;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="max-w-md mx-auto bg-white p-2 md:p-4">
        <p>{product.product_id}</p>
        {product.variants.map((variant) => (
          <button key={variant.variant_id}>{variant.size}</button>
        ))}
        {/* <div className="relative">
          <Image
            src={isHovered ? product.additional_image : product.main_image}
            alt={product.name}
            width={300}
            height={400}
            className="w-full h-auto transition-opacity duration-300"
          />
          <ProductBadges
            product={product}
            selectedVariant={selectedVariant}
            isHovered={isHovered}
          />
          <ProductActions
            product={product}
            selectedVariant={selectedVariant}
            onVariantChange={handleVariantChange}
            isHovered={isHovered}
          />
        </div>
        <ProductInfo
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={handleVariantChange}
        />
        <ProductDeliveryInfo
          product={product}
          selectedVariant={selectedVariant}
        /> */}
      </div>
    </>
  );
}
