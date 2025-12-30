"use client";

import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";

const specialties = [
  {
    name: "Dark Chocolate Ganache",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop",
    price: "$6.50",
    tag: "Bestseller",
    description: "Rich, velvety dark chocolate perfection"
  },
  {
    name: "Belgian Praline Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
    price: "$45.00",
    tag: "Premium",
    description: "Layered Belgian chocolate masterpiece"
  },
  {
    name: "Caramel Truffle Box",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=600&auto=format&fit=crop",
    price: "$28.00",
    tag: "Gift Set",
    description: "Handcrafted truffles in elegant box"
  },
  {
    name: "Artisan Croissant",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop",
    price: "$4.50",
    tag: "Fresh Daily",
    description: "Flaky, buttery French classic"
  },
  {
    name: "Red Velvet Dream",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=600&auto=format&fit=crop",
    price: "$38.00",
    tag: "Popular",
    description: "Classic red velvet with cream cheese"
  },
  {
    name: "Tiramisu Delight",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=600&auto=format&fit=crop",
    price: "$32.00",
    tag: "Italian",
    description: "Espresso-soaked Italian indulgence"
  },
];

export function Specialties() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const x = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section id="specialties" className="py-32 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ x }}
          className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
        />
        <motion.div
          style={{ x: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-caramel/5 rounded-full blur-3xl"
        />
      </div>

      <div ref={ref} className="container mx-auto px-6 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-4"
        >
          <motion.span 
            className="text-sm uppercase tracking-widest text-primary font-semibold inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Signature Collection
          </motion.span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-cormorant)] font-bold tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block"
            >
              Chef's{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block gradient-text italic"
            >
              Specialties
            </motion.span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 w-24 bg-gradient-to-r from-primary to-caramel mx-auto"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden lg:block"
      >
        <div className="flex gap-6 px-6 pb-8 overflow-x-auto no-scrollbar">
          {specialties.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="min-w-[380px] rounded-3xl bg-card border border-primary/10 group cursor-pointer relative overflow-hidden hover:border-primary/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute top-4 left-4"
                >
                  <span className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider">
                    {item.tag}
                  </span>
                </motion.div>
              </div>
              
              <div className="relative z-10 p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-[family-name:var(--font-cormorant)] font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <motion.p 
                    className="text-2xl font-bold gradient-text"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.price}
                  </motion.p>
                </div>
                <p className="text-muted-foreground">{item.description}</p>
                
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  className="h-0.5 bg-gradient-to-r from-primary to-caramel"
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="lg:hidden px-6">
        <Swiper
          modules={[Autoplay, EffectCreative]}
          effect="creative"
          creativeEffect={{
            prev: { translate: ["-120%", 0, -500] },
            next: { translate: ["120%", 0, -500] },
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          className="w-full"
        >
          {specialties.map((item, i) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl bg-card border border-primary/10 overflow-hidden mx-2"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  <span className="absolute top-4 left-4 px-4 py-2 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-[family-name:var(--font-cormorant)] font-bold text-foreground">
                      {item.name}
                    </h3>
                    <p className="text-xl font-bold gradient-text">{item.price}</p>
                  </div>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
