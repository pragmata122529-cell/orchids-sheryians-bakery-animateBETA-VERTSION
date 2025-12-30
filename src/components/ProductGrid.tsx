"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import { MOCK_PRODUCTS, Product } from "@/lib/mockData";
import { ShoppingBag, Heart, Star, Eye, Plus, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCart } from "@/lib/store";

const ProductCard3D = ({ product, index, onAddToCart }: { product: Product; index: number; onAddToCart: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const rotateX = useSpring(useMotionValue(0), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useMotionValue(0), { damping: 20, stiffness: 200 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    rotateY.set((e.clientX - centerX) / 15);
    rotateX.set(-(e.clientY - centerY) / 15);
  };
  
  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      className="group relative"
    >
      <div 
        className="relative bg-card overflow-hidden border border-primary/10 hover:border-primary/50 transition-all duration-700"
        style={{
          clipPath: "polygon(0 0, 95% 0, 100% 8%, 100% 100%, 5% 100%, 0 92%)"
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-caramel/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        />
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-caramel to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative h-72 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.15 : 1 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 30 }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 right-4 flex flex-col gap-3 z-20"
          >
            <motion.button 
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-card/95 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-xl border border-primary/30"
              style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
            >
              <Heart size={20} />
            </motion.button>
            <Link href={`/product/${product.id}`}>
              <motion.button 
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-card/95 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-xl border border-primary/30"
                style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
              >
                <Eye size={20} />
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="absolute bottom-4 left-4 z-20"
          >
            <span 
              className="px-5 py-2 bg-gradient-to-r from-primary to-caramel text-[11px] font-black uppercase tracking-wider text-primary-foreground shadow-lg"
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
            >
              {product.category}
            </span>
          </motion.div>
        </div>
        
        <div className="relative p-6 space-y-4" style={{ transform: "translateZ(30px)" }}>
          <div className="flex justify-between items-start gap-3">
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-wide text-foreground group-hover:text-primary transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>
            <motion.div
              animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
              className="text-right"
            >
              <p className="text-3xl font-black gradient-text">
                ${product.price}
              </p>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-1 py-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + index * 0.1 + i * 0.05 }}
              >
                <Star size={14} className="fill-primary text-primary" />
              </motion.div>
            ))}
            <span className="text-xs text-muted-foreground ml-2 font-bold">(4.9)</span>
          </div>
          
          <motion.div
            className="h-px bg-gradient-to-r from-primary/60 via-caramel/60 to-primary/60"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          
          <div className="pt-3 flex items-center justify-between gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAddToCart}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary via-caramel to-primary text-primary-foreground font-black uppercase tracking-wider shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
              style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
            >
              <Plus size={18} strokeWidth={3} />
              Add to Cart
            </motion.button>
            
            <Link href={`/product/${product.id}`}>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-card border-2 border-primary/40 hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300"
                style={{ clipPath: "polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)" }}
              >
                <ShoppingBag size={22} className="text-primary" />
              </motion.button>
            </Link>
          </div>
          
          <Link href={`/product/${product.id}`}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="flex items-center justify-center gap-2 pt-2 text-primary font-bold text-sm uppercase tracking-wider cursor-pointer hover:underline"
            >
              <Zap size={14} />
              Check Details
              <ShoppingBag size={14} />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export function ProductGrid({ searchQuery = "" }: { searchQuery?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { addItem } = useCart();

  const categories = ["All", "Cakes", "Cupcakes", "Donuts", "Muffins", "Pastries", "Cookies"];

  useEffect(() => {
    function fetchProducts() {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`, {
      icon: <span className="text-lg">🛒</span>
    });
  };

  return (
    <div ref={ref} className="space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {categories.map((category, i) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, y: 30, rotateX: -20 }}
            animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            onClick={() => setActiveCategory(category)}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-8 py-4 text-sm font-black uppercase tracking-wider transition-all duration-500 overflow-hidden ${
              activeCategory === category
                ? "text-primary-foreground shadow-xl shadow-primary/40"
                : "bg-card text-muted-foreground hover:text-foreground border border-primary/20 hover:border-primary/50"
            }`}
            style={{
              clipPath: activeCategory === category 
                ? "polygon(8% 0, 100% 0, 92% 100%, 0 100%)"
                : "polygon(5% 0, 100% 0, 95% 100%, 0 100%)"
            }}
          >
            {activeCategory === category && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-gradient-to-r from-primary via-caramel to-primary"
                transition={{ type: "spring", duration: 0.6 }}
                style={{
                  clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)"
                }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </motion.button>
        ))}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div 
              key={i} 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Skeleton className="h-72 w-full bg-card" style={{ clipPath: "polygon(0 0, 95% 0, 100% 8%, 100% 100%, 5% 100%, 0 92%)" }} />
              <Skeleton className="h-4 w-2/3 bg-card" />
              <Skeleton className="h-4 w-1/2 bg-card" />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <ProductCard3D 
                key={product.id} 
                product={product} 
                index={i}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🍰
          </motion.div>
          <p className="text-muted-foreground text-lg font-bold uppercase tracking-wider">No treats found in this category yet.</p>
          <p className="text-primary text-sm mt-2">Check back soon for delicious additions!</p>
        </motion.div>
      )}
    </div>
  );
}
