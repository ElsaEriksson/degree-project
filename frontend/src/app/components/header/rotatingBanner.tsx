"use client";

import { motion } from "framer-motion";

export function RotatingBanner() {
  const bannerText = [
    "Det står något bra här",
    "Det står något bra här",
    "Det står något bra här",
  ];

  return (
    <div className="bg-black flex items-center text-white overflow-hidden h-8">
      <motion.div
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap"
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between gap-8 mx-8 text-sm">
            {bannerText.map((text, index) => (
              <span key={index}>{text}</span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
