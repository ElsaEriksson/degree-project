"use client";
import { addToCart, getCartItems } from "@/app/lib/actions";
import { CartItems } from "@/app/models/Cart";
import { ProductWithVariants, Variant } from "@/app/models/Product";
import { useCart } from "@/app/providers";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { CheckIcon, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProductCard({
  product,
}: {
  product: ProductWithVariants;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedVariants, setAddedVariants] = useState<Record<number, boolean>>(
    {}
  );

  const { addItemToCart, loading } = useCart();

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

  function handleMouseEnter() {
    setTimeout(() => {
      setIsHovered(true);
    }, 100);
  }

  function handleMouseLeave() {
    setTimeout(() => {
      setIsHovered(false);
    }, 100);
  }

  return (
    <>
      <div className="bg-white p-1">
        <div className="flex flex-col items-center">
          <div
            className="relative w-full h-full"
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
            <div className="w-full absolute bottom-2 px-2 grid grid-cols-[1fr_auto]">
              <div className="grid grid-flow-col">
                {isHovered &&
                  product.variants.map((variant) => (
                    <button
                      type="submit"
                      className="bg-white h-full mr-2 hover:bg-gray-200 flex justify-center items-center"
                      onClick={() => handleClick(variant)}
                      key={variant.variant_id}
                      disabled={variant.stock_quantity === 0}
                    >
                      {addedVariants[variant.variant_id] ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        variant.size
                      )}
                    </button>
                  ))}
              </div>
              <div className="flex justify-end">
                <button className="bg-white rounded-full h-9 w-9 flex justify-center items-center">
                  <Heart />
                  <span className="sr-only">Add to favorites</span>
                </button>
              </div>
            </div>
          </div>
          <p className="uppercase text-center text-sb pt-3">{product.name}</p>
          <p className="text-sb font-semibold pt-1">{product.price} SEK</p>
          {/* <ProductBadges
            product={product}
            selectedVariant={selectedVariant}
            isHovered={isHovered}
          />
          <ProductActions
            product={product}
            selectedVariant={selectedVariant}
            onVariantChange={handleVariantChange}
            isHovered={isHovered}
          /> */}
        </div>
        {/* <ProductInfo
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
