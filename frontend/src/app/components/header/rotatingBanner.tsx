"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

export function RotatingBanner() {
  const bannerText = [
    "1-3 days delivery",
    "Subscribe and enjoy 10% off your first order",
    "Shipping $5.00",
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.scrollWidth / 2;
      controls.start({
        x: [0, -containerWidth],
        transition: {
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        },
      });
    }
  }, [controls]);

  return (
    <>
      <div className="bg-black flex items-center text-white overflow-hidden h-8">
        <motion.div
          ref={containerRef}
          animate={controls}
          className="flex whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between gap-8 mx-8 text-sm font-normal"
            >
              {bannerText.map((text, index) => (
                <span key={index}>{text}</span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
