import ShopButton from "../components/home/shopButton";
import HeroImages from "../components/home/heroImages";
import SeeAllProductsButton from "../components/home/seeAllProductsButton";
import Testimonials from "../components/home/testimonials";
import ScanIcon from "../components/home/scanIcon";
import Collections from "../components/home/collections";
import { Suspense } from "react";
import {
  AnimatedCollectionsSkeleton,
  AnimatedProductListingSkeleton,
} from "../components/skeletons";
import HorizontalProductListWrapper from "../components/horizontalProductListWrapper";

export default async function Home() {
  return (
    <>
      {/* Landing page */}
      <div className="relative mt-4 min-h-screen flex grow flex-col gap-4 md:flex-row relative">
        <ScanIcon></ScanIcon>
        <h1 className="w-full text-center text-2xl absolute z-10 top-1/2 -translate-y-8 font-bold uppercase text-white px-5 tracking-wide">
          Handcrafted Hats
        </h1>
        <ShopButton></ShopButton>
        <HeroImages></HeroImages>
      </div>

      <Testimonials></Testimonials>

      {/* Collections */}
      <section className="px-4 md:px-6 py-16">
        <h2 className="mb-2 text-2xl font-medium tracking-wide text-center">
          COLLECTIONS
        </h2>
        <p className="font-inconsolata pb-7 text-base md:text-lg lg:text-[16px] text-center">
          Discover our exclusive collections of handcrafted hats, made with
          passion and precision. Find your next signature hat today!
        </p>
        <Suspense fallback={<AnimatedCollectionsSkeleton />}>
          <Collections />
        </Suspense>
      </section>

      {/* Featured products list */}
      <section className="px-4 md:px-6 pb-16">
        <h2 className="mb-2 text-2xl font-medium tracking-wide text-center">
          FEATURED PRODUCTS
        </h2>
        <SeeAllProductsButton />
        <Suspense
          fallback={
            <AnimatedProductListingSkeleton></AnimatedProductListingSkeleton>
          }
        >
          <HorizontalProductListWrapper />
        </Suspense>
      </section>
    </>
  );
}
