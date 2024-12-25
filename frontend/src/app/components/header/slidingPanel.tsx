"use client";

import { cn } from "@/app/utils/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  side: "left" | "right";
  children: React.ReactNode;
}

export function SlidingPanel({
  isOpen,
  onClose,
  side,
  children,
}: SlidingPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black cursor-pointer z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: side === "left" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: side === "left" ? "-100%" : "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={cn(
              "fixed top-0 bottom-0 w-[90%] md:w-[60%] lg:w-[30%] bg-white z-50",
              side === "left" ? "left-0" : "right-0"
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
