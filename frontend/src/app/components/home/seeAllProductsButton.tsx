"use client";
import { ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SeeAllProductsButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/products");
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="flex items-center justify-center gap-2 hover:underline hover:cursor-pointer"
      >
        <p className="font-inconsolata text-center text-base md:text-lg lg:text-[16px]">
          SEE ALL PRODUCTS
        </p>
        <ArrowBigRight className="text-black"></ArrowBigRight>
      </div>
    </>
  );
}
