import { fetchCollections } from "@/app/lib/data/getCollections";
import Image from "next/image";
import Link from "next/link";

export default async function Collections() {
  const collections = await fetchCollections();
  const isCollectoinsListEmpty = !collections || collections.length === 0;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isCollectoinsListEmpty ? (
          <div className="text-center text-gray-500 mt-10 pb-10">
            No collections found.
          </div>
        ) : (
          collections.map((collection, index) => (
            <Link
              key={index}
              href={`/collection/${collection.collection_name}`}
              className="relative group overflow-hidden aspect-[4/3] rounded-lg"
            >
              <Image
                src={collection.image}
                alt={`${collection.collection_name} Collection`}
                fill
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/40" />
              <h3 className="absolute uppercase inset-0 flex items-center justify-center text-[20px] font-medium tracking-wider text-white">
                {collection.collection_name}
              </h3>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
