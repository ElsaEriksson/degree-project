"use client";
import { ProductWithVariants } from "@/app/models/Product";
import { useHover } from "@/app/providers";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProductImage({
  product,
}: {
  product: ProductWithVariants;
}) {
  const pathname = usePathname();
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHover();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const slug = generateSlug(product.name);

  const isOnProductPage = pathname === "/product";
  const isOnCollectionPage = pathname.includes("/collection");

  const linkHref = isOnProductPage
    ? `/${product.product_id}-${slug}`
    : `/product/${product.product_id}-${slug}`;

  return (
    <>
      <Link
        href={{
          pathname: linkHref,
          query: {
            page: isOnCollectionPage ? `collection` : "products",
          },
        }}
      >
        <div
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
        </div>
      </Link>
    </>
  );
}
