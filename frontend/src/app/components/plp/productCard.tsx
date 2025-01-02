import { ProductWithVariants } from "@/app/models/Product";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import FavoriteIcon from "./favoriteIcon";
import ProductImage from "./productImage";
import SizeButtons from "./sizeButtons";

export default function ProductCard({
  product,
}: {
  product: ProductWithVariants;
}) {
  return (
    <>
      <div className="bg-white p-1">
        <div className="flex flex-col items-center">
          <div className="relative w-full h-full">
            <ProductImage product={product}></ProductImage>
            <div className="w-full absolute bottom-2 px-2 grid grid-cols-[1fr_auto]">
              <SizeButtons product={product}></SizeButtons>
              <div className="flex justify-end">
                <FavoriteIcon productId={product.product_id}></FavoriteIcon>
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
