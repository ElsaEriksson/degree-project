import ProductCard from "../components/plp/productCard";
import {
  fetchProductsFromDatabase,
  fetchProductVariantsFromDatabase,
} from "../lib/data";

export default async function Products() {
  const products = await fetchProductVariantsFromDatabase();
  console.log(products);
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500">No products found</div>;
  }
  return (
    <>
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-y-6">
          {products.map((product: any) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
