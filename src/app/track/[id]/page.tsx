"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone, Clock, CheckCircle2, Truck, Package, ChefHat, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { format } from "date-fns";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_lat: number;
  delivery_lng: number;
  driver_lat: number;
  driver_lng: number;
  estimated_delivery: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image_url: string;
  };
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "in_transit", label: "On the Way", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [driverPosition, setDriverPosition] = useState({ lat: 0, lng: 0 });

  const fetchOrder = useCallback(async () => {
    const { data: orderData, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !orderData) {
      setLoading(false);
      return;
    }

    setOrder(orderData);
    setDriverPosition({
      lat: orderData.driver_lat || orderData.delivery_lat - 0.01,
      lng: orderData.driver_lng || orderData.delivery_lng - 0.01,
    });

    const { data: items } = await supabase
      .from("order_items")
      .select(`
        id,
        quantity,
        price,
        product:products(name, image_url)
      `)
      .eq("order_id", orderId);

    setOrderItems(items as any || []);
    setLoading(false);
  }, [orderId]);

  useEffect(() => {
    fetchOrder();

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
          if (payload.new.driver_lat && payload.new.driver_lng) {
            setDriverPosition({
              lat: payload.new.driver_lat,
              lng: payload.new.driver_lng,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, fetchOrder]);

  useEffect(() => {
    if (!order || order.status === "delivered" || order.status === "pending") return;

    const interval = setInterval(() => {
      setDriverPosition((prev) => {
        const targetLat = order.delivery_lat || 40.7128;
        const targetLng = order.delivery_lng || -74.006;
        
        const newLat = prev.lat + (targetLat - prev.lat) * 0.05;
        const newLng = prev.lng + (targetLng - prev.lng) * 0.05;
        
        return { lat: newLat, lng: newLng };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [order]);

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex((step) => step.key === order.status);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Order not found</h1>
          <Link href="/">
            <Button className="rounded-full bg-primary text-primary-foreground">
              Go Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-cormorant)] font-bold text-foreground">
                Track Your Order
              </h1>
              <p className="text-muted-foreground">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl bg-card border border-primary/10"
            >
              <div className="flex items-center justify-between mb-8">
                {statusSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isActive = i <= currentStep;
                  const isCurrent = i === currentStep;
                  
                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center gap-2">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isCurrent ? 1.2 : 1,
                            backgroundColor: isActive ? "rgb(201 169 98)" : "rgb(61 35 20)",
                          }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                            isCurrent ? "ring-4 ring-primary/30" : ""
                          }`}
                        >
                          <StepIcon size={20} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                        </motion.div>
                        <span className={`text-xs text-center ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className="flex-1 h-1 mx-2 rounded-full overflow-hidden bg-secondary">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: i < currentStep ? "100%" : "0%" }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-primary"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="text-center py-6 border-t border-primary/10">
                {order.status === "delivered" ? (
                  <div className="space-y-2">
                    <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
                    <p className="text-lg font-medium text-foreground">Order Delivered!</p>
                    <p className="text-sm text-muted-foreground">Thank you for ordering from Home Bakery</p>
                  </div>
                ) : order.status === "in_transit" ? (
                  <div className="space-y-2">
                    <Truck className="w-12 h-12 mx-auto text-blue-500 animate-bounce" />
                    <p className="text-lg font-medium text-foreground">Your order is on the way!</p>
                    <p className="text-sm text-muted-foreground">Estimated arrival in 15-25 minutes</p>
                  </div>
                ) : order.status === "preparing" ? (
                  <div className="space-y-2">
                    <ChefHat className="w-12 h-12 mx-auto text-orange-500" />
                    <p className="text-lg font-medium text-foreground">Preparing your order</p>
                    <p className="text-sm text-muted-foreground">Our chefs are crafting your treats</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Package className="w-12 h-12 mx-auto text-primary" />
                    <p className="text-lg font-medium text-foreground">Order Received</p>
                    <p className="text-sm text-muted-foreground">We'll start preparing it shortly</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl overflow-hidden border border-primary/10 bg-card"
            >
              <div className="p-4 border-b border-primary/10 flex items-center justify-between">
                <h3 className="font-medium text-foreground">Live Location</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </div>
              </div>
              
              <div className="relative h-[300px] bg-secondary/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full max-w-md">
                    <div 
                      className="absolute w-full h-full"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(201,169,98,0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(201,169,98,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                      }}
                    />
                    
                    <motion.div
                      className="absolute"
                      style={{ left: "70%", top: "30%" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="relative">
                        <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping" />
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <MapPin size={16} className="text-primary-foreground" />
                        </div>
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-foreground whitespace-nowrap font-medium">
                          Delivery
                        </span>
                      </div>
                    </motion.div>
                    
                    {order.status !== "delivered" && order.status !== "pending" && (
                      <motion.div
                        className="absolute"
                        animate={{
                          left: order.status === "in_transit" ? "50%" : "20%",
                          top: order.status === "in_transit" ? "50%" : "70%",
                        }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      >
                        <div className="relative">
                          <motion.div 
                            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Truck size={18} className="text-white" />
                          </motion.div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-foreground whitespace-nowrap font-medium">
                            Driver
                          </span>
                        </div>
                      </motion.div>
                    )}
                    
                    <motion.div
                      className="absolute"
                      style={{ left: "20%", top: "70%" }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-caramel flex items-center justify-center">
                        <span className="text-sm">🍫</span>
                      </div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-foreground whitespace-nowrap font-medium">
                        Bakery
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-3xl bg-card border border-primary/10 space-y-6"
            >
              <h3 className="font-[family-name:var(--font-cormorant)] font-bold text-lg text-foreground">
                Order Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Delivery Address</p>
                    <p className="text-sm text-foreground">{order.delivery_address}</p>
                  </div>
                </div>
                
                {order.customer_phone && (
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Contact</p>
                      <p className="text-sm text-foreground">{order.customer_phone}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Order Time</p>
                    <p className="text-sm text-foreground">
                      {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="section-divider" />

              <div className="space-y-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Items</p>
                {orderItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm text-foreground">
                      {item.product?.name || "Product"} × {item.quantity}
                    </span>
                    <span className="text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="section-divider" />

              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-xl font-bold gradient-text">${Number(order.total_amount).toFixed(2)}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/">
                <Button variant="outline" className="w-full rounded-full border-primary/30 h-12">
                  Continue Shopping
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
