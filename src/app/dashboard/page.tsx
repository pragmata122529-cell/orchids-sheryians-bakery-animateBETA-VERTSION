"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Clock, MapPin, Phone, ChevronRight, Truck, CheckCircle2, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name: string;
  delivery_address: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);
      
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      setOrders(ordersData || []);
      setLoading(false);
    };
    
    checkUser();
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in_transit":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "preparing":
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <CircleDot className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "in_transit":
        return "On the way";
      case "preparing":
        return "Preparing";
      default:
        return "Pending";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2 mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-[family-name:var(--font-cormorant)] font-bold text-foreground">
            My Orders
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email?.split("@")[0]}
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-secondary/50 flex items-center justify-center mb-6">
              <Package size={40} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">Start shopping and your orders will appear here</p>
            <Link href="/#menu">
              <Button className="rounded-full bg-primary text-primary-foreground px-8">
                Browse Menu
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link href={`/track/${order.id}`}>
                  <div className="p-6 rounded-2xl bg-card border border-primary/10 hover:border-primary/30 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium text-foreground">
                              Order #{order.id.slice(0, 8).toUpperCase()}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === "delivered" 
                                ? "bg-green-500/20 text-green-500"
                                : order.status === "in_transit"
                                ? "bg-blue-500/20 text-blue-500"
                                : order.status === "preparing"
                                ? "bg-orange-500/20 text-orange-500"
                                : "bg-primary/20 text-primary"
                            }`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold gradient-text">
                          ${Number(order.total_amount).toFixed(2)}
                        </p>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    
                    {order.delivery_address && (
                      <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={14} className="text-primary" />
                        <span className="line-clamp-1">{order.delivery_address}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
