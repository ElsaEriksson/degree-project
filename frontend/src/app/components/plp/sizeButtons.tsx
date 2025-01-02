"use client";
import { ProductWithVariants, Variant } from "@/app/models/Product";
import { useCart, useHover } from "@/app/providers";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

export default function SizeButtons({
  product,
}: {
  product: ProductWithVariants;
}) {
  const [addedVariants, setAddedVariants] = useState<Record<number, boolean>>(
    {}
  );
  const { addItemToCart } = useCart();
  const { isHovered, handleMouseEnter, handleMouseLeave, buttonIsHovered } =
    useHover();

  const handleClick = async (variant: Variant, quantity = 1) => {
    try {
      const result = await addItemToCart(product, variant, quantity);

      if ("success" in result) {
        if (result.success) {
          setAddedVariants((prev) => ({
            ...prev,
            [variant.variant_id]: true,
          }));

          setTimeout(() => {
            setAddedVariants((prev) => ({
              ...prev,
              [variant.variant_id]: false,
            }));
          }, 2000);
        } else {
          console.log("Operation failed.");
        }
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <div
        className="grid grid-flow-col"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        {isHovered &&
          buttonIsHovered &&
          product.variants.map((variant) => (
            <button
              type="submit"
              className={
                variant.stock_quantity === 0
                  ? "bg-white/70 h-full mr-2 cursor-not-allowed"
                  : "bg-white h-full mr-2 border hover:border-black flex justify-center items-center"
              }
              onClick={() => handleClick(variant)}
              key={variant.variant_id}
              disabled={variant.stock_quantity === 0}
              title={variant.stock_quantity === 0 ? "sold out" : ""}
            >
              {addedVariants[variant.variant_id] ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                variant.size
              )}
            </button>
          ))}
      </div>
    </>
  );
}
