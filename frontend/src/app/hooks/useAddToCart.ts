import { useState } from "react";
import { ProductWithVariants, Variant } from "../lib/definitions";

interface AddToCartResult {
  success: boolean;
}

type AddToCartFunction = (
  product: ProductWithVariants,
  variant: Variant,
  quantity: number
) => Promise<AddToCartResult>;

export function useAddToCart(addToCart: AddToCartFunction) {
  const [addedVariants, setAddedVariants] = useState<Record<string, boolean>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async (
    product: ProductWithVariants,
    variant: Variant,
    quantity: number = 1
  ) => {
    setError(null);
    try {
      const result = await addToCart(product, variant, quantity);

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

      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      throw error;
    }
  };

  return { handleAddToCart, addedVariants, error, setError };
}
