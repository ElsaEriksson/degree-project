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
        className="w-full flex gap-4 absolute z-10 top-1/2 hover:cursor-pointer justify-center items-center"
      >
        <h1 className="font-inconsolata text-[22px] font-medium uppercase text-white tracking-wider">
          Shop Now
        </h1>
        <ArrowBigRight className="text-white animate-move-sideways"></ArrowBigRight>
      </div>
    </>
  );
}
