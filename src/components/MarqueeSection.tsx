"use client";

import React from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";

interface MarqueeSectionProps {
  items?: string[];
  speed?: number;
  direction?: "left" | "right";
  variant?: "primary" | "outline";
}

export function MarqueeSection({ 
  items = ["Fresh Baked Daily", "Artisan Chocolate", "Homemade Recipes", "Premium Ingredients", "Made with Love"],
  speed = 50,
  direction = "left",
  variant = "primary"
}: MarqueeSectionProps) {
  return (
    <div className={`py-6 ${variant === "primary" ? "bg-primary" : "bg-transparent border-y border-primary/20"}`}>
      <Marquee speed={speed} direction={direction} gradient={false}>
        <div className="flex items-center gap-12 px-6">
          {[...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center gap-12">
              <span className={`text-xl md:text-2xl font-[family-name:var(--font-cormorant)] font-bold whitespace-nowrap ${
                variant === "primary" ? "text-primary-foreground" : "text-foreground"
              }`}>
                {item}
              </span>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className={`text-2xl ${variant === "primary" ? "text-primary-foreground/80" : "text-primary"}`}
              >
                ✦
              </motion.span>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
