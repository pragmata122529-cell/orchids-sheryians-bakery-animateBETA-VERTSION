"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, MapPin, Phone, Mail, User, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user?.email) {
        setFormData(prev => ({ ...prev, email: user.email || "" }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          total_amount: totalPrice,
          status: "pending",
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          delivery_address: formData.address,
          delivery_lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          delivery_lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete && orderId) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-[family-name:var(--font-cormorant)] font-bold text-foreground">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your order. We'll start preparing it right away.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-primary/10">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-foreground">{orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href={`/track/${orderId}`}>
              <Button className="w-full rounded-full bg-primary text-primary-foreground h-12">
                Track Your Order
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full rounded-full border-primary/30 h-12">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-cormorant)] font-bold text-foreground">
                Checkout
              </h1>
              <p className="text-muted-foreground">Complete your order details below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest text-primary font-medium">
                  Contact Information
                </h3>
                
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="pl-12 h-12 rounded-xl bg-card border-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-12 h-12 rounded-xl bg-card border-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="pl-12 h-12 rounded-xl bg-card border-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest text-primary font-medium">
                  Delivery Address
                </h3>
                
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-muted-foreground" size={18} />
                  <textarea
                    placeholder="Enter your full delivery address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-primary/20 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest text-primary font-medium">
                  Payment Method
                </h3>
                
                <div className="p-4 rounded-xl bg-card border border-primary/20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-medium text-lg shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Place Order • $${totalPrice.toFixed(2)}`
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="sticky top-24">
              <div className="p-6 rounded-3xl bg-card border border-primary/10 space-y-6">
                <h3 className="text-lg font-[family-name:var(--font-cormorant)] font-bold text-foreground">
                  Order Summary
                </h3>

                {items.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
                ) : (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="section-divider" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="section-divider" />
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-foreground">Total</span>
                    <span className="font-bold gradient-text">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
