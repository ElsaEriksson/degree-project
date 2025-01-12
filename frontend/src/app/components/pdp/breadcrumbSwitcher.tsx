import { useSearchParams } from "next/navigation";
import Breadcrumbs from "../breadcrumbs";
import { ProductWithVariants } from "@/app/models/Product";

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
  const page = query.get("frompage");

  return (
    <>
      <div className="pb-4 md:pt-2 md:pb-6">
        <Breadcrumbs
          breadcrumbs={[
            {
              label:
                page === "collection"
                  ? `Collection ${product.collection_name}`
                  : page === "products"
                  ? "Products"
                  : "Home",
              href:
                page === "collection"
                  ? `/collection/${product.collection_name}`
                  : page === "products"
                  ? "/products"
                  : "/",
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
