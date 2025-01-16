"use client";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "../breadcrumbs";
import { ProductWithVariants } from "@/app/lib/definitions";

export default function BreadcrumbSwitcher({
  product,
}: {
  product: ProductWithVariants;
}) {
  const query = useSearchParams();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const nameSlug = generateSlug(product.name);
  const fromPage = query.get("frompage");

  const breadCrumbLabel =
    fromPage === "collection"
      ? `Collection ${product.collection_name}`
      : fromPage === "products"
      ? "Products"
      : "Home";

  const breadCrumbHref =
    fromPage === "collection"
      ? `/collection/${product.collection_name?.toLocaleLowerCase()}`
      : fromPage === "products"
      ? "/products"
      : "/";

  return (
    <>
      <div className="pb-4 md:pt-2 md:pb-6">
        <Breadcrumbs
          breadcrumbs={[
            {
              label: breadCrumbLabel,
              href: breadCrumbHref,
            },
            {
              label: product.name,
              href: `/product/${product.product_id}-${nameSlug}`,
              active: true,
            },
          ]}
        />
      </div>
    </>
  );
}
