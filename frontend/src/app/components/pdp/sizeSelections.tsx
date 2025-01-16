"use client";
import { useAddToCart } from "@/app/hooks/useAddToCart";
import { ProductWithVariants, Variant } from "@/app/lib/definitions";
import { cn } from "@/app/utils/utils";
import { useState } from "react";
import { addToCart } from "@/app/lib/actions/shoppingCart";
import { Button } from "../ui/button";
import { CheckIcon } from "lucide-react";

export default function SizeSelection({
  product,
}: {
  product: ProductWithVariants;
}) {
  const [selectedSize, setSelectedSize] = useState<Variant>();
  const { handleAddToCart, addedVariants, error, setError } =
    useAddToCart(addToCart);

  const showCheckIcon = selectedSize && addedVariants[selectedSize.variant_id];

  const onAddToCart = async (quantity = 1) => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    await handleAddToCart(product, selectedSize, quantity);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {product.variants.map((variant, index) => {
            const isOutOfStock = variant.stock_quantity === 0;
            const isSelected = selectedSize === variant;
            const buttonText = isOutOfStock
              ? `${variant.size} (out of stock)`
              : variant.size;
            const baseButtonClasses =
              "py-2 px-4 border-2 transition-colors text-base lg:text-lg tracking-widest";

            return (
              <button
                disabled={isOutOfStock}
                key={index}
                onClick={() => {
                  setSelectedSize(variant);
                  setError("");
                }}
                className={cn(
                  baseButtonClasses,
                  isSelected ? "border-black" : "border-gray-200",
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "hover:border-gray-400"
                )}
              >
                {buttonText}
              </button>
            );
          })}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Add to cart button */}
      <form action={() => onAddToCart()}>
        <Button
          type="submit"
          className="w-full py-6 text-base md:text-lg rounded-none flex justify-center bg-black hover:bg-black/90 tracking-wider"
        >
          {showCheckIcon ? (
            <CheckIcon className="h-5 w-5" />
          ) : (
            <p>ADD TO CART</p>
          )}
        </Button>
      </form>
    </>
  );
}
