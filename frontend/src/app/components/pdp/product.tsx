"use client";
import { ProductWithVariants, Variant } from "@/app/models/Product";
import { cn } from "@/app/utils/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import FavoriteIcon from "../plp/favoriteIcon";
import ScrollableProductList from "./scrollableProducts";
import PdpAccordion from "./pdpAccordion";
import ThumbnailsAndMainImage from "./thumbnailsAndMainImage";
import { addToCart } from "@/app/lib/actions";
import { CheckIcon } from "lucide-react";
import BreadcrumbSwitcher from "./breadCrumbSwitcher";
import { useAddToCart } from "@/app/hooks/useAddToCart";

export default function Product({
  product,
  collectionProducts,
}: {
  product: ProductWithVariants;
  collectionProducts: ProductWithVariants[];
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
      <div className="container mx-auto">
        <BreadcrumbSwitcher product={product}></BreadcrumbSwitcher>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Image gallery */}
          <div className="relative ">
            <ThumbnailsAndMainImage product={product}></ThumbnailsAndMainImage>
          </div>

          {/* Right side - Product details */}
          <div className="space-y-6 flex flex-col justify-between h-full">
            <div className="w-full">
              <p className="text-base lg:text-lg text-gray-400 tracking-widest font-inconsolata uppercase">
                {product.collection_name} COLLECTION
              </p>
              <h1 className="text-lg my-1 md:text-[25px] lg:text-[32px] xl:text-[40px] font-medium md:my-2 uppercase leading-tight">
                {product.name}
              </h1>
              <div className="flex justify-between items-center w-full">
                <p className="md:text-lg lg:text-xl font-medium mt-2">
                  ${product.price}
                </p>
                <FavoriteIcon productId={product.product_id}></FavoriteIcon>
              </div>
              <p className="text-base xl:text-[15px] text-gray-600 pt-4 md:pt-4 lg:pt-6 xl:pt-8 font-inconsolata">
                {product.description_long}
              </p>
            </div>

            {/* Size selection */}
            <div className="space-y-4 md:space-y-6">
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
            </div>
          </div>
        </div>

        {/* Product accordion with information */}
        <PdpAccordion product={product}></PdpAccordion>

        <h1 className="text-lg md:text-[25px] lg:text-[32px] xl:text-[40px] font-medium uppercase">
          YOU MAY ALSO LIKE
        </h1>

        {/* Products from the same collection */}
        <ScrollableProductList
          products={collectionProducts}
        ></ScrollableProductList>
      </div>
    </>
  );
}
