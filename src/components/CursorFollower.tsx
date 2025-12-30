"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import Image from "next/image";

export function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOnInteractive, setIsOnInteractive] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const addInteractiveListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover], input, textarea, select, [role="button"]');
      
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          setIsHovering(true);
          setIsOnInteractive(true);
        });
        el.addEventListener('mouseleave', () => {
          setIsHovering(false);
          setIsOnInteractive(false);
        });
      });
    };

    addInteractiveListeners();
    
    const observer = new MutationObserver(() => {
      addInteractiveListeners();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 2.5 : 1,
            opacity: isVisible && !isOnInteractive ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4 -ml-2 -mt-2 rounded-full bg-primary"
        />
      </motion.div>
      
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isOnInteractive ? 0 : 1,
            opacity: isVisible && !isOnInteractive ? 1 : 0,
          }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="w-16 h-16 -ml-8 -mt-8"
        >
          <Image
            src="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=100&auto=format&fit=crop"
            alt="Chocolate"
            width={64}
            height={64}
            className="rounded-full object-cover border-2 border-primary/30"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isOnInteractive ? 0 : 1,
            opacity: isVisible && !isOnInteractive ? 0.1 : 0,
          }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-80 h-80 -ml-40 -mt-40 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201, 169, 98, 0.4) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </>
  );
}
