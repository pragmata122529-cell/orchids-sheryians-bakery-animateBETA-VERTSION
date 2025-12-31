"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function LuxuryTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={containerRef} className="h-[60vh] flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--color-gold)_0%,transparent_70%)] blur-[120px]" />
        </div>
      </div>
      
      <motion.div 
        style={{ scale, opacity, y }}
        className="text-center space-y-8 z-10 px-6"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent to-primary" />
          <span className="text-primary tracking-[0.3em] text-xs md:text-sm font-semibold uppercase">Est. 1995</span>
          <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent to-primary" />
        </div>
        
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-[family-name:var(--font-cormorant)] font-bold tracking-tight">
          Crafted with <span className="gradient-text italic">Passion</span>
          <br />
          Baked with <span className="gradient-text italic">Love</span>
        </h2>
        
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Where artisan tradition meets modern elegance. Every creation is a masterpiece designed to delight your senses.
        </p>
        
        <div className="flex justify-center gap-8 mt-12">
          <div className="text-center">
            <p className="text-3xl font-[family-name:var(--font-cormorant)] font-bold text-foreground">100%</p>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Natural</p>
          </div>
          <div className="w-[1px] h-12 bg-primary/20" />
          <div className="text-center">
            <p className="text-3xl font-[family-name:var(--font-cormorant)] font-bold text-foreground">24h</p>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Freshness</p>
          </div>
          <div className="w-[1px] h-12 bg-primary/20" />
          <div className="text-center">
            <p className="text-3xl font-[family-name:var(--font-cormorant)] font-bold text-foreground">Artisan</p>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Craft</p>
          </div>
        </div>
      </motion.div>
      
      {/* Floating decorative elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] text-4xl opacity-20 hidden md:block"
      >
        🥐
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-[15%] text-4xl opacity-20 hidden md:block"
      >
        🥖
      </motion.div>
    </div>
  );
}
