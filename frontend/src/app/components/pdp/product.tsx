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
import Breadcrumbs from "../breadcrumbs";
import { usePathname, useSearchParams } from "next/navigation";

export default function Product({
  product,
  collectionProducts,
}: {
  product: ProductWithVariants;
  collectionProducts: ProductWithVariants[];
}) {
  const [selectedSize, setSelectedSize] = useState<Variant>();
  const [error, setError] = useState("");
  const [addedVariants, setAddedVariants] = useState<Record<number, boolean>>(
    {}
  );
  const query = useSearchParams();

  const handleAddToCart = async (quantity = 1) => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    setError("");
    try {
      const result = await addToCart(product, selectedSize, quantity);

      if ("success" in result) {
        if (result.success) {
          setAddedVariants((prev) => ({
            ...prev,
            [selectedSize.variant_id]: true,
          }));

          setTimeout(() => {
            setAddedVariants((prev) => ({
              ...prev,
              [selectedSize.variant_id]: false,
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const nameSlug = generateSlug(product.name);
  const page = query.get("page");

  return (
    <>
      <div className="container mx-auto">
        <div className="pb-4 md:pt-2 md:pb-6">
          <Breadcrumbs
            breadcrumbs={[
              {
                label:
                  page === "collection"
                    ? `Collection ${product.collection_name}`
                    : "Products",
                href:
                  page === "collection"
                    ? `/collection/${product.collection_name}`
                    : "/products",
              },
              {
                label: product.name,
                href: `/product/${product.product_id}-${nameSlug}`,
                active: true,
              },
            ]}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Image gallery */}
          <div className="relative ">
            <ThumbnailsAndMainImage product={product}></ThumbnailsAndMainImage>
          </div>

          {/* Right side - Product details */}
          <div className="space-y-6 flex flex-col justify-between h-full">
            <div className="w-full">
              <p className="text-base lg:text-lg text-gray-400 tracking-widest font-inconsolata">
                HOWDY COLLECTION
              </p>
              <h1 className="text-lg my-1 md:text-[25px] lg:text-[32px] xl:text-[40px] font-medium md:my-2 uppercase leading-tight">
                {product.name}
              </h1>
              <div className="flex justify-between items-center w-full">
                <p className="md:text-lg lg:text-xl font-medium mt-2">
                  {product.price} KR
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
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSize(variant);
                        setError("");
                      }}
                      className={cn(
                        "py-2 px-4 border-2 hover:border-gray-400 transition-colors text-base lg:text-lg tracking-widest",
                        selectedSize === variant
                          ? "border-black"
                          : "border-gray-200"
                      )}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              {/* Add to cart button */}
              <form action={() => handleAddToCart()}>
                <Button
                  type="submit"
                  className="w-full py-6 text-base md:text-lg rounded-none flex justify-center bg-black hover:bg-black/90 tracking-wider"
                >
                  {selectedSize && addedVariants[selectedSize.variant_id] ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <p>ADD TO CART</p>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
        <PdpAccordion product={product}></PdpAccordion>
        <div className="">
          <h1 className="text-lg md:text-[25px] lg:text-[32px] xl:text-[40px] font-medium uppercase">
            YOU MAY ALSO LIKE
          </h1>
          <ScrollableProductList
            collectionProducts={collectionProducts}
          ></ScrollableProductList>
        </div>
      </div>
    </>
  );
}
