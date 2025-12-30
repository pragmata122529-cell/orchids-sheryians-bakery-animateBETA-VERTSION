"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { icon: "🍫", title: "Premium Chocolate", desc: "Sourced from the finest Belgian cocoa" },
    { icon: "🌿", title: "100% Natural", desc: "No artificial colors or preservatives" },
    { icon: "👨‍🍳", title: "Master Crafted", desc: "Made by award-winning pastry chefs" },
    { icon: "🚚", title: "Fresh Delivery", desc: "Delivered fresh to your doorstep" },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-caramel/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] max-w-[450px] mx-auto lg:mx-0">
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={isInView ? { clipPath: "inset(0% 0 0 0)" } : {}}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-3xl overflow-hidden"
              >
                <Image
                  src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=800&auto=format&fit=crop"
                  alt="Our Kitchen"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden border-4 border-background shadow-2xl hidden md:block"
              >
                <Image
                  src="https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=400&auto=format&fit=crop"
                  alt="Chef at work"
                  fill
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute top-8 -left-8 bg-card/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-primary/20 shadow-xl hidden md:block"
              >
                <p className="text-3xl font-[family-name:var(--font-cormorant)] font-bold gradient-text">4+</p>
                <p className="text-xs text-muted-foreground">Years of Excellence</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="text-sm uppercase tracking-widest text-primary font-medium">
                Our Story
              </span>
              <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-cormorant)] font-bold tracking-tight leading-tight">
                Crafting <span className="gradient-text italic">Moments</span> of Pure Indulgence
              </h2>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Founded in 2020, Home Bakery began as a small passion project in a home kitchen. 
              Today, we've grown into a beloved destination for artisan chocolate and baked goods, 
              while maintaining our commitment to quality, craftsmanship, and the joy of creating 
              something truly special.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Every creation is handcrafted using time-honored techniques and the finest ingredients. 
              From our signature Belgian chocolate ganache to our buttery croissants, we pour our 
              heart into every piece.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="p-4 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-colors group"
                >
                  <span className="text-2xl mb-2 block">{feature.icon}</span>
                  <h4 className="font-medium text-foreground text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
