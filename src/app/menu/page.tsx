"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Filter } from "lucide-react";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px]" 
          />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Delicious Treats</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-[family-name:var(--font-cormorant)] font-bold mb-6"
          >
            Our Full <span className="gradient-text italic">Menu</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12"
          >
            Explore our wide range of handcrafted sweets, baked fresh daily with the finest ingredients. 
            Find your perfect treat and let us make your day special.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-primary/20 blur-xl group-focus-within:bg-primary/30 transition-all duration-500 rounded-full" />
            <div className="relative flex items-center">
              <Search className="absolute left-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search for cakes, cupcakes, cookies..."
                className="w-full h-16 pl-16 pr-8 rounded-full border-primary/20 bg-background/80 backdrop-blur-md text-lg focus-visible:ring-primary/50 transition-all shadow-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-3 p-3 rounded-full bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-lg">
                <Filter size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Menu Grid Section */}
      <section className="pb-24 container mx-auto px-6">
        <ProductGrid searchQuery={searchQuery} />
      </section>

      <Footer />
    </main>
  );
}
