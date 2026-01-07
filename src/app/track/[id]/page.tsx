"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Phone, Clock, CheckCircle2, Truck, Package, ChefHat, Navigation, Info, ShieldCheck, Box, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const TrackingMap = dynamic(() => import("@/components/TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0F0A07] flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-8 relative z-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-2 border-r-2 border-primary rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-b-2 border-l-2 border-primary/40 rounded-full"
          />
          <div className="text-4xl animate-bounce">📦</div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[11px] text-primary font-black uppercase tracking-[0.5em] animate-pulse">Initializing Map HUD</p>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(i => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
});

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
  { key: "pending", label: "Order Placed", icon: Package, color: "text-blue-400" },
  { key: "preparing", label: "Preparing", icon: ChefHat, color: "text-orange-400" },
  { key: "in_transit", label: "On the Way", icon: Truck, color: "text-gold" },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, color: "text-green-400" },
];

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [driverPosition, setDriverPosition] = useState<[number, number]>([0, 0]);

  const bakeryPosition = useMemo<[number, number]>(() => [40.7128, -74.0060], []);
  const deliveryPosition = useMemo<[number, number]>(() => {
    if (order?.delivery_lat && order?.delivery_lng) {
      return [order.delivery_lat, order.delivery_lng];
    }
    return [40.7306, -73.9352]; // Default to nearby NYC
  }, [order]);

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
    
    const lat = orderData.driver_lat || (orderData.delivery_lat ? orderData.delivery_lat - 0.01 : 40.7206);
    const lng = orderData.driver_lng || (orderData.delivery_lng ? orderData.delivery_lng - 0.01 : -73.9852);
    setDriverPosition([lat, lng]);

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
          const newOrder = payload.new as Order;
          setOrder(newOrder);
          if (newOrder.driver_lat && newOrder.driver_lng) {
            setDriverPosition([newOrder.driver_lat, newOrder.driver_lng]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, fetchOrder]);

  // Simulated driver movement if no real updates
  useEffect(() => {
    if (!order || order.status !== "in_transit") return;

    const interval = setInterval(() => {
      setDriverPosition((prev) => {
        const targetLat = deliveryPosition[0];
        const targetLng = deliveryPosition[1];
        
        // Move slightly closer for visual feedback
        const newLat = prev[0] + (targetLat - prev[0]) * 0.02;
        const newLng = prev[1] + (targetLng - prev[1]) * 0.02;
        
        return [newLat, newLng];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [order, deliveryPosition]);

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex((step) => step.key === order.status);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A0705] flex items-center justify-center">
        <div className="flex flex-col items-center gap-12 relative">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-20 bg-primary/10 blur-[100px] rounded-full"
          />
          <div className="relative w-40 h-40">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-[3px] border-primary/20 border-t-primary rounded-[40%] shadow-[0_0_50px_rgba(201,169,98,0.2)]"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-6 border-[2px] border-primary/10 border-b-primary/60 rounded-[35%]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl"
              >
                🚚
              </motion.div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-primary font-[family-name:var(--font-cormorant)] text-3xl tracking-[0.2em] italic font-bold">
              Dispatching Luxury...
            </span>
            <div className="w-48 h-1 bg-primary/10 rounded-full overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#0A0705] flex items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-md p-12 rounded-[40px] bg-[#1A110B] border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto border border-primary/10">
            <Info size={40} className="text-primary" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-[family-name:var(--font-cormorant)] font-bold text-[#FFF8F0]">Order Not Found</h1>
            <p className="text-muted-foreground/70 text-sm leading-relaxed">We couldn't locate an active order with this tracking signature. It may have been completed or cancelled.</p>
          </div>
          <Link href="/">
            <Button className="w-full rounded-full bg-primary text-primary-foreground h-14 text-xs font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform">
              Return to Bakery
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const currentStep = getCurrentStepIndex();

  return (
    <main className="min-h-screen bg-[#0A0705] selection:bg-primary/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 py-12 lg:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link href="/dashboard" className="group inline-flex items-center gap-4 text-muted-foreground hover:text-primary transition-all duration-700">
            <div className="w-12 h-12 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-500">
              <ArrowLeft size={20} />
            </div>
            <span className="font-bold uppercase text-[10px] tracking-[0.3em] opacity-60 group-hover:opacity-100">Order Intelligence</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-[0.3em] backdrop-blur-md">
                    Tactical Tracking
                  </div>
                  <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-black text-green-500 uppercase tracking-[0.3em] backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    Satellite Live
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-cormorant)] font-bold text-[#FFF8F0] leading-[1.1]">
                  Your luxury treats <br />
                  <span className="gradient-text italic">are in transit.</span>
                </h1>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="relative aspect-[16/10] md:aspect-[21/10] lg:aspect-[21/11] rounded-[64px] overflow-hidden border border-primary/20 bg-[#120B07] group shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
            >
              <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-primary/40 rounded-tl-[64px] z-20 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-primary/40 rounded-br-[64px] z-20 pointer-events-none" />
              
              <div className="absolute top-10 left-10 w-4 h-4 border-t-2 border-l-2 border-primary/60 z-20 pointer-events-none" />
              <div className="absolute top-10 right-10 w-4 h-4 border-t-2 border-r-2 border-primary/60 z-20 pointer-events-none" />
              <div className="absolute bottom-10 left-10 w-4 h-4 border-b-2 border-l-2 border-primary/60 z-20 pointer-events-none" />
              <div className="absolute bottom-10 right-10 w-4 h-4 border-b-2 border-r-2 border-primary/60 z-20 pointer-events-none" />

              <div className="absolute top-12 left-12 z-20 flex flex-col gap-5">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-[#1A110B]/60 backdrop-blur-2xl border border-primary/10 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">Telemetry</span>
                    <span className="text-[11px] font-bold text-foreground">Active Uplink</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-[#1A110B]/60 backdrop-blur-2xl border border-primary/10 p-6 rounded-2xl flex flex-col gap-2 shadow-2xl"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Navigation size={12} className="text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">Geo Position</span>
                  </div>
                  <div className="font-mono text-[10px] text-foreground/80 space-y-1 border-l border-primary/20 pl-3">
                    <p>LAT: {driverPosition[0].toFixed(5)}</p>
                    <p>LNG: {driverPosition[1].toFixed(5)}</p>
                  </div>
                </motion.div>
              </div>

              <div className="absolute top-12 right-12 z-20">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-primary p-8 rounded-[40px] flex flex-col items-end gap-1 shadow-[0_20px_50px_rgba(201,169,98,0.4)] border border-white/10"
                >
                  <div className="flex items-center gap-2 opacity-60">
                    <Clock size={12} className="text-primary-foreground" />
                    <p className="text-[9px] text-primary-foreground uppercase font-black tracking-[0.3em]">Est. Delivery</p>
                  </div>
                  <p className="text-4xl font-black text-primary-foreground font-mono tracking-tighter">14:02</p>
                </motion.div>
              </div>

              <TrackingMap 
                bakeryPos={bakeryPosition} 
                deliveryPos={deliveryPosition} 
                driverPos={driverPosition} 
                status={order.status}
              />

              <div className="absolute bottom-12 left-12 right-12 z-20 flex justify-between items-end">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="bg-[#1A110B]/80 backdrop-blur-2xl border border-primary/20 p-6 rounded-[32px] flex items-center gap-6 shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                    <Truck size={28} className="text-primary relative z-10" />
                  </div>
                  <div>
                    <p className="text-[10px] text-primary/60 uppercase font-black tracking-[0.3em] mb-1">Logistics Unit</p>
                    <p className="text-base font-bold text-foreground">Gourmet Caddy #Alpha-7</p>
                    <div className="flex gap-1.5 mt-2">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className={`h-1 w-6 rounded-full transition-all duration-1000 ${i <= 4 ? 'bg-primary shadow-[0_0_8px_rgba(201,169,98,0.5)]' : 'bg-primary/10'}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                <div className="flex flex-col gap-4 items-end">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 }}
                    className="bg-card/40 backdrop-blur-2xl border border-primary/20 px-8 py-5 rounded-full flex items-center gap-4 hover:bg-card/60 transition-all duration-500 cursor-help shadow-2xl"
                  >
                    <div className="relative">
                      <Zap size={20} className="text-primary" />
                      <div className="absolute inset-0 blur-md bg-primary/40 animate-pulse" />
                    </div>
                    <span className="text-[11px] font-black text-foreground uppercase tracking-[0.4em]">Neural Guidance Active</span>
                  </motion.div>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-30 bg-[length:100%_2px,3px_100%]" />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-20 z-10">
                <div className="absolute inset-0 border border-primary/20 rounded-full animate-[ping_5s_infinite]" />
                <div className="absolute inset-40 border border-primary/10 rounded-full animate-[ping_7s_infinite]" />
                <div className="absolute inset-80 border border-primary/5 rounded-full animate-[ping_9s_infinite]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-12 rounded-[56px] bg-[#1A110B] border border-primary/10 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              
              <div className="relative flex items-center justify-between mb-16 px-4">
                {statusSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isActive = i <= currentStep;
                  const isCurrent = i === currentStep;
                  
                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center gap-5 relative z-10 group">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isCurrent ? 1.25 : 1,
                            backgroundColor: isActive ? "rgba(201, 169, 98, 1)" : "rgba(18, 11, 7, 1)",
                            borderColor: isCurrent ? "rgba(201, 169, 98, 0.5)" : "rgba(61, 35, 20, 1)",
                          }}
                          className={`w-16 h-16 rounded-[24px] border-2 flex items-center justify-center transition-all duration-1000 ${
                            isCurrent ? "shadow-[0_0_40px_rgba(201,169,98,0.5)]" : "group-hover:border-primary/40"
                          }`}
                        >
                          <StepIcon size={24} className={isActive ? "text-primary-foreground" : "text-primary/20"} />
                        </motion.div>
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isActive ? "text-primary" : "text-muted-foreground/30"}`}>
                            {step.label}
                          </span>
                          {isCurrent && (
                            <motion.div 
                              layoutId="active-indicator"
                              className="w-2 h-2 rounded-full bg-primary shadow-[0_0_15px_rgba(201,169,98,1)]"
                            />
                          )}
                        </div>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className="flex-1 h-[2px] mx-6 bg-primary/5 relative overflow-hidden rounded-full">
                          <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: i < currentStep ? "0%" : "-100%" }}
                            transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary to-primary/20"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div className="relative p-12 bg-[#120B07] rounded-[48px] border border-primary/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={order.status}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col md:flex-row items-center gap-12"
                  >
                    <div className="shrink-0">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border border-dashed border-primary/20 rounded-full"
                        />
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-4 border border-dashed border-primary/10 rounded-full"
                        />
                        <div className="relative z-10 bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center border border-primary/20 backdrop-blur-sm shadow-2xl">
                          {order.status === "delivered" ? (
                            <CheckCircle2 size={40} className="text-green-500" />
                          ) : order.status === "in_transit" ? (
                            <Truck size={40} className="text-primary animate-bounce" />
                          ) : order.status === "preparing" ? (
                            <ChefHat size={40} className="text-orange-400" />
                          ) : (
                            <Package size={40} className="text-primary" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 text-center md:text-left flex-1">
                      <h3 className="text-4xl font-[family-name:var(--font-cormorant)] font-bold text-[#FFF8F0] italic">
                        {order.status === "delivered" ? "Mission Accomplished" : 
                         order.status === "in_transit" ? "Premium Transit Underway" :
                         order.status === "preparing" ? "Master Crafting" : 
                         "Order Synchronized"}
                      </h3>
                      <p className="text-base text-muted-foreground/70 leading-relaxed max-w-xl">
                        {order.status === "delivered" ? "Your artisan treats have reached their final destination. Our courier has confirmed hand-delivery. Bon appétit." : 
                         order.status === "in_transit" ? "Our specialized delivery unit is navigating to your location. Temperature control is active and stable. Expect arrival shortly." :
                         order.status === "preparing" ? "Our master chocolatiers are applying the final touches to your selection. Perfection takes time, and you're seconds away." : 
                         "We have received your request and initialized our gourmet logistics chain. Your order is currently awaiting master review."}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="p-10 rounded-[56px] bg-[#1A110B] border border-primary/10 space-y-10 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-center justify-between">
                <h3 className="font-[family-name:var(--font-cormorant)] font-bold text-2xl text-[#FFF8F0] flex items-center gap-3 italic">
                  Manifest Details
                </h3>
                <Box size={20} className="text-primary/40" />
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 shadow-inner">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-primary/40 uppercase font-black tracking-[0.3em] mb-2">Target Location</p>
                    <p className="text-sm text-[#FFF8F0]/90 leading-relaxed font-medium">{order.delivery_address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10 shadow-inner">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-primary/40 uppercase font-black tracking-[0.3em] mb-2">Timestamp</p>
                    <p className="text-sm text-[#FFF8F0]/90 font-medium">
                      {format(new Date(order.created_at), "MMMM d, yyyy")}
                      <span className="text-primary/50 ml-3 font-mono text-[11px] tracking-widest">{format(new Date(order.created_at), "HH:mm")}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

              <div className="space-y-5">
                <p className="text-[10px] text-primary/40 uppercase font-black tracking-[0.3em]">Inventory Manifest</p>
                <div className="space-y-4">
                  {orderItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(201,169,98,1)] transition-all duration-500" />
                        <span className="text-sm text-[#FFF8F0]/70 font-medium group-hover:text-[#FFF8F0] transition-colors">
                          {item.product?.name || "Artisan Product"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold text-primary/40">×{item.quantity}</span>
                        <span className="text-sm text-primary font-mono font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

              <div className="pt-6 flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-primary/40 uppercase font-black tracking-[0.3em] mb-2">Total Valuation</p>
                  <p className="text-4xl font-black font-mono tracking-tighter text-[#FFF8F0] shadow-sm">${Number(order.total_amount).toFixed(2)}</p>
                </div>
                <div className="text-right pb-1">
                  <div className="px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-black text-green-500 uppercase tracking-[0.3em] backdrop-blur-sm shadow-lg">
                    Secured
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <Link href="/">
                <Button variant="outline" className="w-full rounded-[32px] border-primary/20 hover:border-primary/60 bg-transparent h-16 text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-700 hover:bg-primary/5 shadow-xl">
                  Continue Exploration
                </Button>
              </Link>
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground/40 hover:text-primary text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500"
                  onClick={() => window.print()}
                >
                  Retrieve Digital Receipt
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .gradient-text {
          background: linear-gradient(to right, #C9A962, #FFF8F0, #C9A962);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shine 8s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}</style>
    </main>
  );
}
