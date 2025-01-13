import { cn } from "@/app/utils/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScrollMode({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsHomePage(pathname === "/");
  }, [pathname]);

  const headerBackgroundColor =
    isScrolled || !isHomePage ? "bg-white" : "bg-transparent";

  return (
    <>
      {/* Manages the behavior and styling of a fixed header
       * based on the user's scroll position and the current page. */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-30 transition-colors duration-300",
          headerBackgroundColor
        )}
      >
        {children}
      </div>
    </>
  );
}
