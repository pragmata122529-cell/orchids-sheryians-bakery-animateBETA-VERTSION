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
    <section id="specialties" className="py-32 overflow-hidden relative bg-[#0F0A07]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A962' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <motion.div
          style={{ x }}
          className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2"
        />
        <motion.div
          style={{ x: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-caramel/10 rounded-full blur-[120px]"
        />
      </div>

      <div ref={ref} className="container mx-auto px-6 mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-4"
        >
            <div className="flex items-center justify-center gap-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={isInView ? { width: "2rem" } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-[1px] bg-primary/30" 
              />
              <motion.span 
                className="text-sm uppercase tracking-[0.4em] text-primary font-bold inline-block font-[family-name:var(--font-playfair)]"
                initial={{ opacity: 0, letterSpacing: "0.2em" }}
                animate={isInView ? { opacity: 1, letterSpacing: "0.4em" } : {}}
                transition={{ duration: 1, delay: 0.1 }}
              >
                Exquisite Selection
              </motion.span>
              <motion.div 
                initial={{ width: 0 }}
                animate={isInView ? { width: "2rem" } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-[1px] bg-primary/30" 
              />
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-[family-name:var(--font-playfair)] font-bold tracking-tight text-cream">
              <motion.span
                initial={{ opacity: 0, y: 100, rotateX: 45 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                The{" "}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 100, rotateX: 45 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block gradient-text italic"
              >
                Signature
              </motion.span>
            </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground/60 text-lg max-w-xl mx-auto font-light"
          >
            A curated collection of our most celebrated creations, handcrafted with precision and the world's finest ingredients.
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="hidden lg:block"
      >
          <div className="flex gap-10 px-12 pb-12 overflow-x-auto no-scrollbar">
            {specialties.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -20, scale: 1.02 }}
                className="min-w-[420px] rounded-[2.5rem] bg-[#1A110B] border border-primary/10 group cursor-pointer relative overflow-hidden transition-all duration-700 shadow-2xl luxury-shadow"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,169,98,0.08),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="corner-light animate-corner-light" />
                
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0 contrast-[1.1]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A110B] via-transparent to-transparent opacity-60" />
                  
                  <motion.div
                    className="absolute top-6 left-6 z-20"
                  >
                    <span className="px-6 py-2 bg-primary/90 backdrop-blur-md text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
                      {item.tag}
                    </span>
                  </motion.div>
                </div>
                
                <div className="relative z-10 p-10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-4xl font-[family-name:var(--font-playfair)] font-bold leading-[1.1] text-cream group-hover:text-primary transition-colors duration-500">
                        {item.name}
                      </h3>
                      <p className="text-3xl font-bold gradient-text shrink-0">
                        {item.price}
                      </p>
                    </div>
                    <p className="text-muted-foreground/80 font-light leading-relaxed italic text-lg">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 group/btn overflow-hidden">
                    <motion.div 
                      className="h-[1px] flex-1 bg-primary/10 group-hover:bg-primary/40 transition-colors"
                      whileHover={{ scaleX: 1.1 }}
                    />
                    <span className="text-[11px] uppercase tracking-[0.4em] text-primary/60 group-hover:text-primary transition-all duration-500 font-bold">Discover</span>
                    <motion.div 
                      className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary transition-all duration-500"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
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
