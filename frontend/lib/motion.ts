import type { Variants } from "framer-motion";

export const TRANSITIONS = {
  fast: { duration: 0.2, ease: "easeOut" as const },
  normal: { duration: 0.4, ease: "easeOut" as const },
  slow: { duration: 0.8, ease: "easeInOut" as const },
  spring: { type: "spring" as const, stiffness: 100, damping: 15 }
};

export const VARIANTS: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: TRANSITIONS.normal }
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: TRANSITIONS.normal }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: TRANSITIONS.normal }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: TRANSITIONS.normal }
  }
};
