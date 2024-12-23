import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-4 flex grow flex-col gap-4 md:flex-row relative">
      <Image
        src={
          "https://exlriuzrrlvaujqsogjs.supabase.co/storage/v1/object/sign/images/elsakaisa_A_mannequin_with_long_blonde_hair_and_bangs_wearing_a_340e32cb-9c92-4854-a314-203988ef3ac8%20kopiera.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvZWxzYWthaXNhX0FfbWFubmVxdWluX3dpdGhfbG9uZ19ibG9uZGVfaGFpcl9hbmRfYmFuZ3Nfd2VhcmluZ19hXzM0MGUzMmNiLTljOTItNDg1NC1hMzE0LTIwMzk4OGVmM2FjOCBrb3BpZXJhLmpwZyIsImlhdCI6MTczNDk1MzIyOSwiZXhwIjoxNzY2NDg5MjI5fQ.LtirnppMPrm90xCgWInjJaq8uzMGn876VtLiiUlpong&t=2024-12-23T11%3A27%3A10.938Z"
        }
        layout="fill"
        objectFit="cover"
        className="hidden md:block"
        alt="Screenshots of the dashboard project showing desktop version"
        priority
      />
      {/* <Image
          src="/hero-mobile.png"
          width={560}
          height={620}
          className="block md:hidden"
          alt="Screenshot of the dashboard project showing mobile version"
        /> */}
      {/* </div> */}
    </div>
  );
}
