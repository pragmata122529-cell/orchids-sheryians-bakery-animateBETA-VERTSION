"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowUpRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const quickLinks = ["Menu", "Specialties", "Our Story", "Reviews", "Contact"];
  const categories = ["Cakes", "Cupcakes", "Donuts", "Truffles", "Pastries"];

  return (
    <footer ref={ref} className="relative pt-32 pb-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          style={{ y }}
          className="absolute bottom-0 left-1/2 w-[1200px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm uppercase tracking-widest text-primary font-semibold inline-block mb-4"
          >
            Get in Touch
          </motion.span>
          
          <h2 className="text-5xl md:text-6xl lg:text-8xl font-[family-name:var(--font-cormorant)] font-bold tracking-tight mb-8">
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block"
            >
              Let's Create Something
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block gradient-text italic"
            >
              Delicious
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block"
            >
              {" "}Together
            </motion.span>
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="#menu">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-caramel text-primary-foreground rounded-full font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-shadow text-lg"
              >
                Order Now
                <motion.span
                  animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-primary/40 hover:border-primary text-foreground rounded-full font-medium hover:bg-primary/10 transition-all text-lg"
            >
              <Mail className="w-5 h-5 text-primary" />
              Contact Us
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-14 h-14 bg-gradient-to-br from-primary to-caramel rounded-full flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <span className="text-3xl">🍰</span>
              </motion.div>
              <span className="text-2xl font-[family-name:var(--font-cormorant)] font-bold tracking-tight text-foreground">
                Home<span className="gradient-text">Bakery</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Crafting artisan baked goods with passion since 1980. 
              Every creation tells a story of quality and dedication.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h4 className="text-sm uppercase tracking-widest text-primary font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((item, i) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <Link 
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2"
                  >
                    <motion.span
                      initial={{ width: 0 }}
                      whileHover={{ width: 16 }}
                      className="h-px bg-primary"
                      transition={{ duration: 0.3 }}
                    />
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h4 className="text-sm uppercase tracking-widest text-primary font-semibold mb-6">Categories</h4>
            <ul className="space-y-4">
              {categories.map((item, i) => (
                <motion.li 
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  <Link 
                    href="#menu" 
                    className="text-muted-foreground hover:text-primary transition-colors group flex items-center gap-2"
                  >
                    <motion.span
                      initial={{ width: 0 }}
                      whileHover={{ width: 16 }}
                      className="h-px bg-primary"
                      transition={{ duration: 0.3 }}
                    />
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-6"
          >
            <h4 className="text-sm uppercase tracking-widest text-primary font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <motion.li 
                className="flex items-start gap-4 group"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin size={18} className="text-primary" />
                </div>
                <span className="text-muted-foreground text-sm">123 Chocolate Lane, Sweet City, SC 54321</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-4 group"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone size={18} className="text-primary" />
                </div>
                <span className="text-muted-foreground text-sm">+1 (555) 123-4567</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-4 group"
                whileHover={{ x: 5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail size={18} className="text-primary" />
                </div>
                <span className="text-muted-foreground text-sm">hello@homebakery.com</span>
              </motion.li>
            </ul>
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-card border border-primary/20 rounded-full text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-8"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
        >
          <p>© 2024 Home Bakery. Crafted with love.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookies"].map((item, i) => (
              <motion.span key={item} whileHover={{ color: "#C9A962" }} className="cursor-pointer transition-colors">
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
