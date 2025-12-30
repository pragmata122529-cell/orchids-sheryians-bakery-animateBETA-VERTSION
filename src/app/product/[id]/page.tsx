"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShoppingCart, ArrowLeft, Star, Clock, ShieldCheck, Truck, Plus, Minus, Heart, Zap, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import { CursorFollower } from "@/components/CursorFollower";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        router.push("/#menu");
      } else {
        setProduct(data);
        
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .eq("category", data.category)
          .neq("id", id)
          .limit(3);
        
        setRelatedProducts(related || []);
      }
      setLoading(false);
    }
    if (id) fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      toast.success(`${product.name} added to cart!`, {
        icon: "🍰"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          🍰
        </motion.div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <CursorFollower />
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-wider text-sm">Back to Collection</span>
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square overflow-hidden group"
              style={{
                clipPath: "polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)"
              }}
            >
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 w-14 h-14 bg-card/80 backdrop-blur-md flex items-center justify-center text-primary shadow-xl border border-primary/20"
                style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
              >
                <Heart size={24} />
              </motion.button>
              
              <div className="absolute bottom-6 left-6">
                <span 
                  className="px-6 py-3 bg-gradient-to-r from-primary to-caramel text-sm font-black uppercase tracking-wider text-primary-foreground shadow-lg"
                  style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
                >
                  {product.category}
                </span>
              </div>
            </motion.div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={18} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground">4.9</span>
                  <span className="text-xs text-muted-foreground">(120+ Reviews)</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wide text-foreground">
                  {product.name}
                </h1>
                
                <motion.p 
                  className="text-4xl font-black gradient-text"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ${product.price}
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-lg leading-relaxed space-y-4"
              >
                <p>{product.description}</p>
                <p>
                  Experience the perfect balance of flavors with our handcrafted {product.name.toLowerCase()}. 
                  Made with premium organic ingredients and baked fresh in our artisan kitchen every morning.
                </p>
              </motion.div>

              <div className="h-px bg-gradient-to-r from-primary/50 via-caramel/50 to-primary/50" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-8">
                  <div 
                    className="flex items-center gap-4 bg-card p-2 border border-primary/20"
                    style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 bg-background flex items-center justify-center hover:text-primary transition-colors"
                    >
                      <Minus size={20} strokeWidth={3} />
                    </motion.button>
                    <span className="text-2xl font-black min-w-[3rem] text-center">{quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 bg-background flex items-center justify-center hover:text-primary transition-colors"
                    >
                      <Plus size={20} strokeWidth={3} />
                    </motion.button>
                  </div>
                  <p className="text-muted-foreground font-bold">
                    Total: <span className="text-foreground text-2xl font-black gradient-text">${(product.price * quantity).toFixed(2)}</span>
                  </p>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-3 h-16 bg-gradient-to-r from-primary via-caramel to-primary text-primary-foreground font-black text-lg uppercase tracking-wider shadow-xl shadow-primary/30"
                    style={{ clipPath: "polygon(3% 0, 100% 0, 97% 100%, 0 100%)" }}
                  >
                    <ShoppingCart size={24} />
                    Add to Cart
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 bg-card border-2 border-primary/40 hover:border-primary flex items-center justify-center transition-all"
                    style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
                  >
                    <ShoppingBag size={24} className="text-primary" />
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { icon: Clock, label: "Freshly Baked", sub: "Daily Morning" },
                  { icon: ShieldCheck, label: "Eco Friendly", sub: "Recycled Pack" },
                  { icon: Truck, label: "Fast Delivery", sub: "Within 2 Hours" },
                ].map((feature, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5 }}
                    className="p-4 bg-card border border-primary/10 text-center space-y-2"
                    style={{ clipPath: "polygon(0 0, 90% 0, 100% 20%, 100% 100%, 10% 100%, 0 80%)" }}
                  >
                    <div 
                      className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-caramel/20 flex items-center justify-center text-primary"
                      style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
                    >
                      <feature.icon size={22} />
                    </div>
                    <p className="text-xs font-black uppercase text-foreground">{feature.label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{feature.sub}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-32"
            >
              <div className="flex items-center gap-4 mb-12">
                <Zap className="text-primary" size={24} />
                <h2 className="text-3xl font-black uppercase tracking-wider">Related Products</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((item, i) => (
                  <Link key={item.id} href={`/product/${item.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="group bg-card border border-primary/10 hover:border-primary/50 transition-all duration-500 overflow-hidden"
                      style={{ clipPath: "polygon(0 0, 95% 0, 100% 8%, 100% 100%, 5% 100%, 0 92%)" }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      </div>
                      <div className="p-6 space-y-2">
                        <h3 className="font-black uppercase tracking-wide group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xl font-black gradient-text">${item.price}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
