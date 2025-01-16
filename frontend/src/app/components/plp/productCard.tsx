import { ProductWithVariants } from "@/app/lib/definitions";
import FavoriteIcon from "./favoriteIcon";
import ProductImage from "./productImage";
import SizeButtons from "./sizeButtons";

export default function ProductCard({
  product,
}: {
  product: ProductWithVariants;
}) {
  const allVariantsSoldOut = product.variants.every(
    (variant) => variant.stock_quantity === 0
  );
  const isSoldOut = allVariantsSoldOut ? "SOLD OUT" : "";

  return (
    <>
      <div className="bg-white p-1" id="productCard">
        <div className="flex flex-col items-center">
          <div className="relative w-full h-full">
            {/* Product card image */}
            <ProductImage product={product}></ProductImage>

            {/* "Sold out" badge, displayed if the product is out of stock */}
            <p className="absolute top-2 left-3 text-xs md:text-base lg:text-xs xl:text-base font-semibold">
              {isSoldOut}
            </p>

            <div className="w-full absolute bottom-2 px-2 grid grid-cols-[1fr_auto]">
              {/* Buttons for size selection */}
              <SizeButtons product={product}></SizeButtons>

              {/* Icon to mark product as a favorite */}
              <div className="flex justify-end">
                <FavoriteIcon productId={product.product_id}></FavoriteIcon>
              </div>
            </div>
          </div>

          {/* Product card name and price  */}
          <p className="uppercase text-center text-xs pt-3 md:text-sm font-normal xl:text-base">
            {product.name}
          </p>
          <p className="text-xs font-semibold pt-1 md:text-sm xl:text-base">
            ${product.price}.00
          </p>
        </div>
      </div>
    </>
  );
}
