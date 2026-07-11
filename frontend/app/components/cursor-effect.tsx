"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CursorEffect() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Track actual mouse position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smoothly trail behind the mouse
  const springConfig = { damping: 25, stiffness: 150, mass: 0.3 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // useTransform must be called before any conditional returns
  const glowX = useTransform(smoothX, (v) => v - 112);
  const glowY = useTransform(smoothY, (v) => v - 112);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const moveCursor = (e: MouseEvent) => {
      // Center the 32x32 trailing ring (offset by half its size)
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible, mounted]);

  // Don't render until client-side hydration is complete to avoid mismatch
  if (!mounted) return null;

  // ponytail: disable on mobile touch devices entirely to save INP / DOM overhead
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-[1.5px] border-[#00C3FF]/40 pointer-events-none z-[9999]"
        style={{
          x: smoothX,
          y: smoothY,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ opacity: { duration: 0.3 } }}
      />
      
      {/* Soft Follow Glow */}
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 rounded-full pointer-events-none z-[9998] blur-[60px]"
        style={{
          x: glowX,
          y: glowY,
          opacity: isVisible ? 0.15 : 0,
          background: "radial-gradient(circle, rgba(0,195,255,0.8) 0%, rgba(124,58,237,0.4) 100%)"
        }}
        transition={{ opacity: { duration: 0.5 } }}
      />
    </>
  );
}
