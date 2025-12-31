"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, ChevronDown, Sparkles, ShoppingBag, Gift, Star } from "lucide-react";
import Link from "next/link";

const GlitchText = ({ children, delay = 0 }: { children: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.span 
      ref={ref}
      className="relative inline-block"
      initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
      } : {}}
      transition={{ 
        duration: 1.2, 
        delay,
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      <motion.span
        animate={isInView ? {
          textShadow: [
            "0 0 0px transparent",
            "2px 2px 0px #C9A962, -2px -2px 0px #D4A574",
            "0 0 0px transparent"
          ]
        } : {}}
        transition={{ duration: 0.3, delay: delay + 0.8 }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

  const ChocolateDripButton = ({ 
    children, 
    href,
    variant = "primary"
  }: { 
    children: React.ReactNode; 
    href: string;
    variant?: "primary" | "outline";
  }) => {
    return (
      <Link href={href}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative group overflow-visible h-16 px-10 text-lg font-bold transition-all duration-300 ${
            variant === "primary" 
              ? "bg-gradient-to-r from-primary via-caramel to-primary text-primary-foreground shadow-2xl shadow-primary/40" 
              : "bg-transparent border-2 border-primary/50 text-foreground hover:border-primary"
          }`}
          style={{
            clipPath: "polygon(8% 0, 100% 0, 100% 70%, 92% 100%, 0 100%, 0 30%)"
          }}
        >
          {/* Falling chocolate drips */}
          <div className="absolute inset-x-0 -top-4 h-20 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-8 bg-chocolate rounded-full"
                style={{ left: `${15 + i * 15}%` }}
                initial={{ y: -40, opacity: 0 }}
                whileHover={{ 
                  y: [null, 60],
                  opacity: [0, 1, 0],
                  scaleY: [1, 2, 1]
                }}
                transition={{ 
                  duration: 0.8 + Math.random() * 0.4, 
                  repeat: Infinity,
                  repeatDelay: Math.random() * 0.5,
                  ease: "easeIn"
                }}
              />
            ))}
          </div>

          <motion.div
            className="absolute -top-3 left-1/4 w-8 h-10 bg-chocolate-dark rounded-b-full opacity-0 group-hover:opacity-100"
            initial={{ height: 0 }}
            whileHover={{ height: 24 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          <motion.div
            className="absolute -top-3 left-1/2 w-6 h-12 bg-chocolate rounded-b-full opacity-0 group-hover:opacity-100"
            initial={{ height: 0 }}
            whileHover={{ height: 32 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          />
          <motion.div
            className="absolute -top-3 right-1/4 w-5 h-8 bg-chocolate-light rounded-b-full opacity-0 group-hover:opacity-100"
            initial={{ height: 0 }}
            whileHover={{ height: 20 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
          />
          
          <span className="relative z-10 flex items-center gap-3">
            {children}
          </span>
        
        {variant === "primary" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-caramel via-primary to-caramel opacity-0 group-hover:opacity-100"
            style={{
              clipPath: "polygon(8% 0, 100% 0, 100% 70%, 92% 100%, 0 100%, 0 30%)"
            }}
            transition={{ duration: 0.4 }}
          />
        )}
      </motion.button>
    </Link>
  );
};

const FloatingElement = ({ 
  children, 
  delay = 0, 
  duration = 6,
  x = 0,
  y = 20 
}: { 
  children: React.ReactNode; 
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}) => (
  <motion.div
    animate={{ 
      y: [0, -y, 0],
      x: [0, x, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      duration, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

export function Hero() {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  
  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[200vh] overflow-hidden"
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(201, 169, 98, 0.08) 0%, transparent 100%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="absolute inset-0 opacity-30">
          {mounted && [...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/50"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              }}
              animate={{
                y: [null, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div 
        style={{ opacity, scale }}
        className="sticky top-0 min-h-screen flex flex-col justify-center items-center pt-28"
      >
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="space-y-8 text-center lg:text-left"
              style={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/20 to-caramel/20 backdrop-blur-xl border border-primary/30"
                style={{
                  clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)"
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-sm font-semibold text-primary tracking-wider uppercase">
                  Artisan Baked Goods
                </span>
              </motion.div>

                <div className="space-y-2 overflow-hidden">
                  <h1 className="font-[family-name:var(--font-playfair)] text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] font-black tracking-tight leading-[0.8]">
                    <div className="overflow-hidden pb-4">
                      <GlitchText delay={0.3}>Home</GlitchText>
                    </div>
                    <div className="overflow-hidden">
                      <motion.span
                        initial={{ y: "100%", rotateX: -45 }}
                        animate={{ y: 0, rotateX: 0 }}
                        transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-block"
                      >
                        <span className="gradient-text italic relative pr-4">
                          Bakery
                          <motion.span
                            className="absolute -bottom-4 left-0 w-full h-2 bg-gradient-to-r from-primary via-caramel to-primary"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.2, delay: 1.5 }}
                          />
                        </span>
                      </motion.span>
                    </div>
                  </h1>

                
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-1 w-32 bg-gradient-to-r from-primary to-caramel origin-left mx-auto lg:mx-0"
                />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                Where every bite tells a story. Handcrafted with passion, 
                baked with love, delivered with warmth.
              </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4"
                >
                  <ChocolateDripButton href="/menu" variant="primary">
                    <ShoppingBag className="w-5 h-5" />
                    Order Now
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </ChocolateDripButton>
                  
                  <ChocolateDripButton href="/#about" variant="outline">
                    Our Story
                  </ChocolateDripButton>
                </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="flex items-center gap-10 pt-8 justify-center lg:justify-start"
              >
                {[
                  { value: "50+", label: "Recipes" },
                  { value: "100%", label: "Natural" },
                  { value: "5★", label: "Rated" },
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + i * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.p 
                      className="text-3xl md:text-4xl font-bold gradient-text font-[family-name:var(--font-cormorant)]"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
              style={{ 
                x: -mousePosition.x * 0.3, 
                y: -mousePosition.y * 0.3,
                rotateY: mousePosition.x * 0.5,
                rotateX: -mousePosition.y * 0.5
              }}
            >
              <div className="relative aspect-square max-w-[600px] mx-auto">
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <path
                        id="circlePath"
                        d="M 200, 200 m -180, 0 a 180,180 0 1,1 360,0 a 180,180 0 1,1 -360,0"
                      />
                    </defs>
                    <text className="fill-primary/30 text-[14px] uppercase tracking-[0.5em] font-medium">
                      <textPath href="#circlePath">
                        ✦ Fresh Daily ✦ Artisan Made ✦ Premium Quality ✦ Homemade Recipes ✦
                      </textPath>
                    </text>
                  </svg>
                </motion.div>

                <motion.div
                  className="absolute inset-12 rounded-full overflow-hidden glow-gold"
                  initial={{ clipPath: "circle(0% at 50% 50%)" }}
                  animate={{ clipPath: "circle(100% at 50% 50%)" }}
                  transition={{ duration: 1.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
                    alt="Artisan Chocolate Cake"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </motion.div>

                <FloatingElement delay={0} duration={5} y={15}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="absolute -left-4 top-1/4 w-24 h-24 md:w-32 md:h-32"
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-background shadow-2xl">
                      <Image
                        src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&auto=format&fit=crop"
                        alt="Chocolate Donut"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                </FloatingElement>

                <FloatingElement delay={1} duration={6} y={20} x={10}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="absolute -right-4 top-1/3 w-20 h-20 md:w-28 md:h-28"
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl">
                      <Image
                        src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&auto=format&fit=crop"
                        alt="Chocolate Truffles"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                </FloatingElement>

                <FloatingElement delay={2} duration={7} y={12}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.8 }}
                    className="absolute left-1/4 -bottom-4 w-20 h-20 md:w-24 md:h-24"
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-background shadow-2xl">
                      <Image
                        src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop"
                        alt="Croissant"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </motion.div>
                </FloatingElement>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 2 }}
                  className="absolute -bottom-8 right-0 bg-card/95 backdrop-blur-xl px-6 py-4 rounded-2xl border border-primary/20 shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-caramel flex items-center justify-center"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <span className="text-3xl">🍰</span>
                    </motion.div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fresh Baked</p>
                      <p className="text-lg font-bold text-foreground">Every Morning</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground group-hover:text-primary transition-colors font-medium">
              Scroll Down
            </span>
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2 group-hover:border-primary transition-colors"
            >
              <motion.div
                animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="h-screen relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-chocolate-dark/50 to-background" />
          
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-64 bg-gradient-to-b from-chocolate via-chocolate-dark to-transparent rounded-b-full opacity-30"
                style={{
                  left: `${10 + i * 12}%`,
                  top: -100,
                }}
                animate={{
                  y: [0, 50, 0],
                  scaleY: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-5xl mx-auto px-6"
          >
            <div className="relative p-12 md:p-20 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(61, 35, 20, 0.9) 0%, rgba(30, 17, 10, 0.95) 100%)",
                clipPath: "polygon(3% 0, 97% 0, 100% 5%, 100% 95%, 97% 100%, 3% 100%, 0 95%, 0 5%)"
              }}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-caramel to-transparent" />
              
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-caramel/10 rounded-full blur-3xl" />
              
              <motion.div
                className="absolute top-4 right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Star className="w-8 h-8 text-primary/30" />
              </motion.div>

              <div className="relative z-10 text-center space-y-8">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 px-8 py-3 border border-primary/40 bg-primary/10 backdrop-blur-sm"
                  style={{
                    clipPath: "polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)"
                  }}
                >
                  <Gift className="w-5 h-5 text-primary" />
                  <span className="text-primary font-bold uppercase tracking-[0.3em] text-sm">Limited Time Offer</span>
                </motion.div>

                  <motion.h2
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl lg:text-9xl font-[family-name:var(--font-playfair)] font-bold tracking-tight"
                  >
                    <span className="text-foreground">New Year</span>
                    <br />
                    <span className="gradient-text italic">Special</span>
                  </motion.h2>


                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
                >
                  Indulge in our exclusive collection of handcrafted delights. 
                  <span className="text-primary font-semibold"> 25% OFF</span> on all premium cakes & pastries.
                </motion.p>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-8 justify-center pt-4"
                >
                  {[
                    { value: "25%", label: "Discount" },
                    { value: "48", label: "Hours Left" },
                    { value: "∞", label: "Happiness" },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <motion.p
                        className="text-4xl md:text-5xl font-bold gradient-text font-[family-name:var(--font-cormorant)]"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {item.value}
                      </motion.p>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{item.label}</p>
                    </div>
                  ))}
                </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="pt-6"
                  >
                    <ChocolateDripButton href="/menu" variant="primary">
                      <ShoppingBag className="w-5 h-5" />
                      Shop Collection
                      <ArrowRight className="w-5 h-5" />
                    </ChocolateDripButton>
                  </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
