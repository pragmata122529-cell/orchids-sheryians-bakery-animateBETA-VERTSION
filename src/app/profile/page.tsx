"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight,
  ShoppingBag,
  Clock,
  Heart,
  Camera,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CursorFollower } from "@/components/CursorFollower";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
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
    }
    getProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    toast.success("Signed out successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
        >
          🍰
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <CursorFollower />
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 space-y-8"
            >
              <div 
                className="bg-card border border-primary/20 overflow-hidden shadow-xl"
                style={{ clipPath: "polygon(0 0, 95% 0, 100% 3%, 100% 100%, 5% 100%, 0 97%)" }}
              >
                <div className="h-32 bg-gradient-to-r from-primary/30 via-caramel/30 to-primary/30 relative overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-20 h-40 bg-gradient-to-b from-chocolate to-transparent rounded-b-full opacity-20"
                      style={{ left: `${i * 25}%`, top: -20 }}
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
                <div className="px-8 pb-8 -mt-16 text-center relative">
                  <div className="relative inline-block group">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                      className="w-32 h-32 bg-background border-4 border-card overflow-hidden shadow-2xl relative"
                      style={{ clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)" }}
                    >
                      <Image
                        src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-br from-primary to-caramel text-primary-foreground flex items-center justify-center shadow-lg"
                      style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
                    >
                      <Camera size={18} />
                    </motion.button>
                  </div>

                  <div className="mt-6 space-y-2">
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-black uppercase tracking-wide text-foreground"
                    >
                      {user?.user_metadata?.full_name || "Bakery Lover"}
                    </motion.h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {[
                      { value: orders.length, label: "Orders" },
                      { value: 0, label: "Points" },
                      { value: 0, label: "Reviews" },
                    ].map((stat, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="p-3 bg-primary/5 border border-primary/10"
                        style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)" }}
                      >
                        <p className="text-xl font-black text-primary">{stat.value}</p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-primary/10 p-4 space-y-2">
                  {[
                    { icon: User, label: "Edit Profile", active: true },
                    { icon: MapPin, label: "Saved Addresses" },
                    { icon: Heart, label: "My Favorites" },
                    { icon: Settings, label: "Settings" },
                  ].map((item, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      whileHover={{ x: 5 }}
                      className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${
                        item.active 
                        ? "bg-gradient-to-r from-primary to-caramel text-primary-foreground shadow-lg" 
                        : "hover:bg-primary/5 text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ clipPath: item.active ? "polygon(3% 0, 100% 0, 97% 100%, 0 100%)" : undefined }}
                    >
                      <div className="flex items-center gap-4">
                        <item.icon size={20} />
                        <span className="font-bold uppercase tracking-wider text-sm">{item.label}</span>
                      </div>
                      <ChevronRight size={16} />
                    </motion.button>
                  ))}
                  
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    whileHover={{ x: 5 }}
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/5 transition-all duration-300"
                  >
                    <LogOut size={20} />
                    <span className="font-bold uppercase tracking-wider text-sm">Sign Out</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-8 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: ShoppingBag, title: "Active Orders", desc: "Track your delicious treats", gradient: "from-primary to-caramel" },
                  { icon: Clock, title: "Order History", desc: "Rediscover your favorites", gradient: "from-amber-500 to-orange-400" },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    whileHover={{ y: -8 }}
                    className="p-8 bg-card border border-primary/10 relative overflow-hidden group"
                    style={{ clipPath: "polygon(0 0, 95% 0, 100% 10%, 100% 100%, 5% 100%, 0 90%)" }}
                  >
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-caramel to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative space-y-4">
                      <div 
                        className={`w-14 h-14 bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg`}
                        style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
                      >
                        <card.icon size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-wide text-foreground">{card.title}</h3>
                        <p className="text-muted-foreground">{card.desc}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 bg-card border border-primary/30 hover:border-primary text-foreground font-bold uppercase tracking-wider text-sm"
                        style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
                      >
                        View All
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <Zap className="text-primary" size={24} />
                  <h2 className="text-3xl font-black uppercase tracking-wider">
                    Recent <span className="gradient-text">Orders</span>
                  </h2>
                </div>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20 bg-card border border-dashed border-primary/20"
                      style={{ clipPath: "polygon(0 0, 98% 0, 100% 5%, 100% 100%, 2% 100%, 0 95%)" }}
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-6xl mb-4"
                      >
                        🍰
                      </motion.div>
                      <p className="text-muted-foreground font-bold uppercase tracking-wider">No orders yet. Time to treat yourself!</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/#menu")} 
                        className="mt-6 px-8 py-4 bg-gradient-to-r from-primary to-caramel text-primary-foreground font-black uppercase tracking-wider shadow-xl"
                        style={{ clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0 100%)" }}
                      >
                        Start Shopping
                      </motion.button>
                    </motion.div>
                  ) : (
                    orders.slice(0, 3).map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="p-6 bg-card border border-primary/10 hover:border-primary/40 transition-all group flex items-center gap-6"
                        style={{ clipPath: "polygon(0 0, 98% 0, 100% 15%, 100% 100%, 2% 100%, 0 85%)" }}
                      >
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-20 h-20 bg-primary/5 flex items-center justify-center text-3xl shrink-0"
                          style={{ clipPath: "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)" }}
                        >
                          {order.status === "delivered" ? "✅" : "📦"}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
                            <span className={`px-3 py-1 text-[10px] font-black uppercase ${
                              order.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                              order.status === "delivered" ? "bg-green-500/10 text-green-500" :
                              "bg-primary/10 text-primary"
                            }`}
                            style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)" }}
                            >
                              {order.status}
                            </span>
                          </div>
                          <h4 className="font-black uppercase tracking-wide truncate">Order from {new Date(order.created_at).toLocaleDateString()}</h4>
                          <p className="text-sm text-muted-foreground">Total: <span className="gradient-text font-bold">${Number(order.total_amount).toFixed(2)}</span></p>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/track/${order.id}`)}
                          className="px-6 py-3 bg-gradient-to-r from-primary to-caramel text-primary-foreground font-black uppercase tracking-wider text-sm shadow-lg"
                          style={{ clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0 100%)" }}
                        >
                          Track
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
