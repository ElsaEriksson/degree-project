"use client";
import { ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ShopButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/products");
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="w-full flex absolute z-10 top-36 md:top-44 lg:top-48 items-center md:justify-start gap-2 md:gap-4 px-5 lg:px-6 hover:cursor-pointer"
      >
        <h1 className="font-inconsolata text-[22px] md:text-[30px] font-bold uppercase text-black tracking-wider">
          Shop Now
        </h1>
        <ArrowBigRight className="text-black animate-move-sideways"></ArrowBigRight>
      </div>
    </>
  );
}
