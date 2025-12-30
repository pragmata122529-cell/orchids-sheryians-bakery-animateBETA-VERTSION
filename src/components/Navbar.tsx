"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ShoppingCart, User, Menu, X, LogOut, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { Cart } from "./Cart";
import { toast } from "sonner";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Placeholder user for demo
    setUser({ email: "guest@example.com" });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  const navLinks = [
    { name: "Menu", href: "/menu" },
    { name: "Specialties", href: "/#specialties" },
    { name: "About", href: "/#about" },
    { name: "Reviews", href: "/#reviews" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl py-4 border-b border-primary/10"
            : "bg-transparent py-6"
        }`}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-caramel to-primary origin-left"
          style={{ scaleX }}
        />
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gradient-to-br from-primary to-caramel rounded-full flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <span className="text-2xl">🍫</span>
            </motion.div>
            <span className="text-xl font-[family-name:var(--font-cormorant)] font-bold tracking-tight text-foreground">
              Home<span className="gradient-text">Bakery</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -2 }}
              >
                <Link
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover-underline"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full hover:bg-secondary gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Package size={18} />
                    <span className="hidden lg:inline">Orders</span>
                  </Button>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full border border-primary/10">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary to-caramel rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold uppercase">
                    {user.email?.[0]}
                  </div>
                  <span className="text-xs font-medium text-foreground truncate max-w-[80px]">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive w-9 h-9"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-secondary w-10 h-10"
                onClick={() => setIsAuthOpen(true)}
              >
                <User size={20} className="text-muted-foreground" />
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-secondary relative w-10 h-10"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={20} className="text-muted-foreground" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <Link href="/menu">
              <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-medium">
                Order Now
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-secondary relative w-10 h-10"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={22} className="text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            <button
              className="text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card/95 backdrop-blur-xl border-t border-primary/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={item.href}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors block py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="section-divider my-2" />
                <div className="flex items-center gap-3 py-2">
                    {user ? (
                      <>
                        <Link href="/dashboard" className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full rounded-full border-primary/30 text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            My Orders
                          </Button>
                        </Link>
                        <Button 
                          onClick={handleLogout} 
                          variant="outline" 
                          className="flex-1 rounded-full border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        variant="outline" 
                        className="flex-1 rounded-full border-primary/30 text-foreground"
                      >
                        Login
                      </Button>
                    )}
                  </div>
                  <Button 
                    className="w-full rounded-full bg-primary text-primary-foreground h-12 text-base"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                  >
                    View Cart ({cartCount})
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
        
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </>
    );
  }

