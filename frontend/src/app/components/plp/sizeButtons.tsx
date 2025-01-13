"use client";
import { useAddToCart } from "@/app/hooks/useAddToCart";
import { addToCart } from "@/app/lib/actions/shoppingCart";
import { ProductWithVariants, Variant } from "@/app/models/Product";
import { useHover } from "@/app/providers";
import { CheckIcon } from "lucide-react";

export default function SizeButtons({
  product,
}: {
  product: ProductWithVariants;
}) {
  const { isHovered, handleMouseEnter, handleMouseLeave, buttonIsHovered } =
    useHover();

  const { handleAddToCart, addedVariants } = useAddToCart(addToCart);

  const onAddToCart = async (
    product: ProductWithVariants,
    variant: Variant,
    quantity = 1
  ) => {
    await handleAddToCart(product, variant, quantity);
  };

  return (
    <>
      <div
        className="grid grid-flow-col"
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        {/* Render variant buttons with sizes only if the component is hovered */}
        {isHovered &&
          buttonIsHovered &&
          product.variants.map((variant) => {
            const isOutOfStock = variant.stock_quantity === 0;
            const showCheckIcon = addedVariants[variant.variant_id];

            return (
              <form
                action={() => onAddToCart(product, variant)}
                key={variant.variant_id}
                className="mr-2"
              >
                <button
                  type="submit"
                  className={
                    isOutOfStock
                      ? "bg-white/70 h-full cursor-not-allowed w-full"
                      : "bg-white h-full border-2 hover:border-gray-600 flex justify-center items-center w-full"
                  }
                  disabled={isOutOfStock}
                  title={isOutOfStock ? "sold out" : ""}
                >
                  {/* Show a check icon if the variant is in the cart, otherwise display the size */}
                  {showCheckIcon ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <p className="text-xs md:text-sm xl:text-base tracking-widest">
                      {variant.size}
                    </p>
                  )}
                </button>
              </form>
            );
          })}
      </div>
    </>
  );
}
