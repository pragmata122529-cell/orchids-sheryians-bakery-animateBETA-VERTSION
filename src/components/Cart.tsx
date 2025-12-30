"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-[70] shadow-2xl flex flex-col border-l border-primary/10"
          >
            <div className="p-6 border-b border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShoppingBag className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-[family-name:var(--font-cormorant)] font-bold text-foreground">Your Cart</h2>
                  <p className="text-xs text-muted-foreground">{items.length} items</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-secondary/50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} className="text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Add some delicious treats!</p>
                  </div>
                  <Button 
                    onClick={onClose} 
                    variant="outline" 
                    className="rounded-full border-primary/30 text-foreground hover:bg-primary/10"
                  >
                    Browse Menu
                  </Button>
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-primary/10 group hover:border-primary/20 transition-colors"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-foreground text-sm line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">${item.price} each</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-background/50 rounded-full px-2 py-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Minus size={12} />
                          </motion.button>
                          <span className="font-bold text-sm w-6 text-center text-foreground">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Plus size={12} />
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-primary/10 space-y-4 bg-background/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-500 font-medium">Free</span>
                </div>
                <div className="section-divider" />
                <div className="flex justify-between text-lg">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold gradient-text">${totalPrice.toFixed(2)}</span>
                </div>
                
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full rounded-full h-14 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-medium group">
                    Checkout
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors py-2"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
