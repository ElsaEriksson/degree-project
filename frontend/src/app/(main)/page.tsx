import Image from "next/image";
import {
  fetchCollectionFromDatabase,
  fetchFeaturedProductsFromDatabase,
} from "../lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import ScrollableProductList from "../components/pdp/scrollableProducts";
import ShopButton from "../components/home/shopButton";
import HeroImages from "../components/home/heroImages";
import SeeAllProductsButton from "../components/home/seeAllProductsButton";

interface ExtendedCollection {
  title: string;
  image: string;
  href: string;
}

export default async function Home() {
  const collections = await fetchCollectionFromDatabase();
  const featuredProducts = await fetchFeaturedProductsFromDatabase();

  if (!collections) {
    notFound();
  }

  if (!featuredProducts) {
    notFound();
  }

  const extendedCollections: ExtendedCollection[] = [
    {
      title: "BEIGELACE",
      image:
        "https://exlriuzrrlvaujqsogjs.supabase.co/storage/v1/object/sign/images/Lace%20Regal%20Cap.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvTGFjZSBSZWdhbCBDYXAuanBlZyIsImlhdCI6MTczNjU5OTU3NSwiZXhwIjoxNzY4MTM1NTc1fQ.7WO4N80jQAc6qWOFewot8NwMO-YOFjD5eQkLLUDJ64M&t=2025-01-11T12%3A46%3A16.318Z",
      href: "/collection/beigelace",
    },
    {
      title: "COLORFUR",
      image:
        "https://exlriuzrrlvaujqsogjs.supabase.co/storage/v1/object/sign/images/Vibrant%20Feathered%20Layered%20Hat.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvVmlicmFudCBGZWF0aGVyZWQgTGF5ZXJlZCBIYXQuanBlZyIsImlhdCI6MTczNjU5OTYyNSwiZXhwIjoxNzY4MTM1NjI1fQ.LCBEljpxA3hkEvZHLctS-C9cRByfqxFqwtaUBXXUnaY&t=2025-01-11T12%3A47%3A05.774Z",
      href: "/collection/colorfur",
    },
    {
      title: "HOWDY",
      image:
        "https://exlriuzrrlvaujqsogjs.supabase.co/storage/v1/object/sign/images/Feathered%20Statement%20Hat.jpeg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvRmVhdGhlcmVkIFN0YXRlbWVudCBIYXQuanBlZyIsImlhdCI6MTczNjU5OTYwNCwiZXhwIjoxNzY4MTM1NjA0fQ.LE4p_a7m3jgC6wUrmBFNljV9VwSDWeswK6eZ_XunZJ0&t=2025-01-11T12%3A46%3A45.308Z",
      href: "/collection/howdy",
    },
  ];

  return (
    <>
      <div className="relative mt-4 min-h-screen flex grow flex-col gap-4 md:flex-row relative">
        <h1 className="w-full text-left text-[30px] md:text-[65px] lg:text-[90px] xl:text-[110px] absolute z-10 top-24 md:top-20 lg:top-16 font-bold uppercase text-black px-5">
          Handcrafted Hats
        </h1>
        <ShopButton></ShopButton>
        {/* <p className="w-full -rotate-90 absolute z-10 text-red-600 font-inconsolata top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:text-xl lg:rotate-0 lg:translate-y-0 lg:text-left lg:top-auto lg:bottom-10 lg:px-6">
          For those who dare to make a statement.
        </p> */}
        <HeroImages></HeroImages>
      </div>
      <section className="px-4 md:px-6 py-12">
        <h2 className="mb-2 text-2xl font-medium tracking-wide text-center">
          COLLECTIONS
        </h2>
        <p className="font-inconsolata pb-8 text-center">
          Discover our exclusive collections of handcrafted hats, made with
          passion and precision. Find your next signature hat today!
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {extendedCollections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className="relative group overflow-hidden aspect-[4/3] rounded-lg"
            >
              <Image
                src={collection.image}
                alt={`${collection.title} Collection`}
                fill
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/40" />
              <h3 className="absolute inset-0 flex items-center justify-center text-2xl font-medium tracking-wider text-white">
                {collection.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="px-4 md:px-6 pb-12">
        <h2 className="mb-2 text-2xl font-medium tracking-wide text-center">
          FEATURED PRODUCTS
        </h2>
        <SeeAllProductsButton />
        <ScrollableProductList
          products={featuredProducts}
        ></ScrollableProductList>
      </section>
    </>
  );
}
