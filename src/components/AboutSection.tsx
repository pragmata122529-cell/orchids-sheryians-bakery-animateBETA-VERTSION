"use client";

import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Clock, Leaf, Award, Heart, Sparkles } from "lucide-react";

const features = [
  { icon: Clock, title: "Fresh Daily", desc: "Baked every morning at 5 AM", gradient: "from-primary to-caramel" },
  { icon: Leaf, title: "100% Natural", desc: "No artificial preservatives", gradient: "from-emerald-500 to-green-400" },
  { icon: Award, title: "Award Winning", desc: "Best bakery 2023 & 2024", gradient: "from-amber-500 to-yellow-400" },
  { icon: Heart, title: "Made with Love", desc: "Family recipes since 1980", gradient: "from-rose-500 to-pink-400" },
];

export function AboutSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section id="about" ref={containerRef} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 -right-40 w-96 h-96 rounded-full bg-caramel/5 blur-3xl"
        />
        
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.div 
              style={{ rotate }}
              className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0"
            >
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={isInView ? { clipPath: "inset(0% 0 0 0)" } : {}}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: "polygon(0 0, 90% 0, 100% 10%, 100% 100%, 10% 100%, 0 90%)"
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1556217477-d325251ece38?q=80&w=800&auto=format&fit=crop"
                  alt="Baker at work"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -bottom-8 -right-8 bg-card/95 backdrop-blur-xl p-8 border border-primary/20 shadow-2xl"
                style={{
                  clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)"
                }}
              >
                <div className="text-center space-y-2">
                  <motion.p 
                    className="text-6xl font-black gradient-text font-[family-name:var(--font-cormorant)]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    44+
                  </motion.p>
                  <p className="text-sm text-muted-foreground uppercase tracking-[0.2em] font-bold">Years of Tradition</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -top-6 -left-6 w-28 h-28 bg-gradient-to-br from-primary to-caramel flex items-center justify-center shadow-2xl"
                style={{
                  clipPath: "polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)"
                }}
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-5xl"
                >
                  🥧
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/30"
                style={{
                  clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)"
                }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm uppercase tracking-[0.2em] text-primary font-bold">Our Story</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-cormorant)] font-bold leading-tight"
              >
                Baking <span className="gradient-text italic">Happiness</span>
                <br />Since 1980
              </motion.h2>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="h-1 w-32 bg-gradient-to-r from-primary to-caramel origin-left"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              What started as a small family kitchen has grown into a beloved bakery, 
              but our heart remains the same. Every morning at 5 AM, we begin our ritual 
              of creating handcrafted treats using recipes passed down through three generations.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-muted-foreground text-lg leading-relaxed"
            >
              We believe that the best ingredients, combined with passion and patience, 
              create moments of pure joy. No shortcuts, no compromises—just honest, 
              delicious baking that brings people together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 gap-5 pt-6"
            >
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateX: -20 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 + i * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative p-6 bg-card/80 backdrop-blur-sm border border-primary/10 hover:border-primary/40 transition-all duration-500 group overflow-hidden"
                  style={{
                    clipPath: "polygon(0 0, 92% 0, 100% 15%, 100% 100%, 8% 100%, 0 85%)"
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-caramel to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 space-y-3">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.15 }}
                      className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                      style={{
                        clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)"
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <h4 className="font-black uppercase tracking-wide text-foreground group-hover:text-primary transition-colors text-lg">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
