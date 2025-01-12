import Image from "next/image";

export default function HeroImages() {
  return (
    <>
      <Image
        src={
          "https://exlriuzrrlvaujqsogjs.supabase.co/storage/v1/object/sign/images/elsakaisa_A_mannequin_with_long_blonde_hair_and_bangs_wearing_a_340e32cb-9c92-4854-a314-203988ef3ac8%20kopiera.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvZWxzYWthaXNhX0FfbWFubmVxdWluX3dpdGhfbG9uZ19ibG9uZGVfaGFpcl9hbmRfYmFuZ3Nfd2VhcmluZ19hXzM0MGUzMmNiLTljOTItNDg1NC1hMzE0LTIwMzk4OGVmM2FjOCBrb3BpZXJhLmpwZyIsImlhdCI6MTczNDk1MzIyOSwiZXhwIjoxNzY2NDg5MjI5fQ.LtirnppMPrm90xCgWInjJaq8uzMGn876VtLiiUlpong&t=2024-12-23T11%3A27%3A10.938Z"
        }
        layout="fill"
        objectFit="cover"
        className="hidden md:block"
        alt="Hero image desktop version"
        priority
      />
      <Image
        src={
          "https://exlriuzrrlvaujqsogjs.supabase.co/storage/v1/object/sign/images/hero-2.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvaGVyby0yLnBuZyIsImlhdCI6MTczNjU5NjQyOCwiZXhwIjoxNzY4MTMyNDI4fQ.qrpBNARyQd51eBfl-JhsfOMNeTbOhDhLoEX1WaRb1fY&t=2025-01-11T11%3A53%3A49.362Z"
        }
        layout="fill"
        objectFit="cover"
        className="block md:hidden"
        alt="Hero image mobile version"
        priority
      />
    </>
  );
}
