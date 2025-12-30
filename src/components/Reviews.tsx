"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { MOCK_REVIEWS, Review } from "@/lib/mockData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

export function Reviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  useEffect(() => {
    function fetchReviews() {
      setReviews(MOCK_REVIEWS);
    }
    fetchReviews();
  }, []);

  const fallbackReviews = [
    { id: "1", rating: 5, comment: "Absolutely divine! The chocolate cake melted in my mouth. Best bakery experience ever!", user_name: "Sarah Mitchell", created_at: "" },
    { id: "2", rating: 5, comment: "Best bakery I've ever tried. The croissants are perfection - crispy outside, soft inside!", user_name: "Michael Rodriguez", created_at: "" },
    { id: "3", rating: 5, comment: "The truffle box was an amazing gift. My mom loved it! Will definitely order again.", user_name: "Emma Watson", created_at: "" },
    { id: "4", rating: 5, comment: "Every bite is a journey of flavors. The attention to detail is remarkable!", user_name: "David Chen", created_at: "" },
    { id: "5", rating: 5, comment: "Their custom birthday cake exceeded all expectations. Truly magical!", user_name: "Lisa Park", created_at: "" },
    { id: "6", rating: 5, comment: "Fresh, delicious, and made with love. You can taste the quality in every product.", user_name: "James Wilson", created_at: "" },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <section id="reviews" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ y }}
          className="absolute top-0 left-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-caramel/5 rounded-full blur-3xl"
        />
      </div>

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-16"
        >
          <motion.span 
            className="text-sm uppercase tracking-widest text-primary font-semibold inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Testimonials
          </motion.span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-cormorant)] font-bold tracking-tight">
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block"
            >
              What Our{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block gradient-text italic"
            >
              Customers
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block"
            >
              {" "}Say
            </motion.span>
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-1 w-24 bg-gradient-to-r from-primary to-caramel mx-auto"
          />
        </motion.div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.slice(0, 6).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-card p-8 rounded-3xl border border-primary/10 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={60} className="text-primary" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.4 + i * 0.1 + j * 0.05 }}
                    >
                      <Star
                        size={18}
                        className={j < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}
                      />
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-foreground/90 leading-relaxed text-lg">
                  "{review.comment}"
                </p>
                
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                  className="h-px bg-gradient-to-r from-primary/50 to-transparent"
                />
                
                <div className="flex items-center gap-4 pt-2">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-caramel flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {review.user_name.charAt(0)}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-foreground">{review.user_name}</p>
                    <p className="text-xs text-primary uppercase tracking-wider">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, EffectCards]}
            effect="cards"
            grabCursor
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="w-full max-w-sm mx-auto"
          >
            {displayReviews.map((review, i) => (
              <SwiperSlide key={review.id}>
                <div className="bg-card p-6 rounded-3xl border border-primary/10">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        className={j < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}
                      />
                    ))}
                  </div>
                  <p className="text-foreground/90 mb-4">"{review.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-caramel flex items-center justify-center text-primary-foreground font-bold">
                      {review.user_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{review.user_name}</p>
                      <p className="text-xs text-primary">Verified Buyer</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-8 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-primary/10">
            {[
              { value: "4.9", label: "Average Rating" },
              { value: "2000+", label: "Happy Customers" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 + i * 0.1 }}
                className="text-center px-4"
              >
                <motion.p 
                  className="text-3xl font-bold gradient-text font-[family-name:var(--font-cormorant)]"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
