import { useState } from "react";
import { ProductWithVariants, Variant } from "../models/Product";

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
        // Mark the variant as added
        setAddedVariants((prev) => ({
          ...prev,
          [variant.variant_id]: true,
        }));

        // Reset the variant's added state after 2 seconds
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
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return { handleAddToCart, addedVariants, error, setError };
}
