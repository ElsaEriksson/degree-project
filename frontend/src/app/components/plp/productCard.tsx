"use client";
import { addToCart, getCartItems } from "@/app/lib/actions";
import { CartItems } from "@/app/models/Cart";
import { Product, ProductWithVariants, Variant } from "@/app/models/Product";
import { useCart } from "@/app/providers";
import Image from "next/image";
import { useState } from "react";

export default function ProductCard({
  product,
}: {
  product: ProductWithVariants;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { setCartItems } = useCart();

  const handleClick = async (variant: Variant) => {
    try {
      const result = await addToCart(product, variant);

      let total = 0;
      if (Array.isArray(result)) {
        total = result.reduce((sum, item) => sum + item.quantity, 0);
      } else if (result && "quantity" in result) {
        const cartItems = await getCartItems();
        total = cartItems.reduce(
          (sum: number, item: CartItems) => sum + item.quantity,
          0
        );
      }
      setCartItems(total);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-white p-2 md:p-4">
        <p>{product.product_id}</p>
        {product.variants.map((variant) => (
          <button onClick={() => handleClick(variant)} key={variant.variant_id}>
            {variant.size}
          </button>
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
