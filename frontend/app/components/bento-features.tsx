"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BENTO_ITEMS = [
  {
    title: "Speech To Text",
    desc: "Lightning fast transcription using Whisper.",
    icon: "🎙️",
    className: "col-span-1 row-span-1",
  },
  {
    title: "AI Summary",
    desc: "Executive overviews in seconds.",
    icon: "📝",
    className: "col-span-1 row-span-1",
  },
  {
    title: "Action Items",
    desc: "Never miss a followup task.",
    icon: "✅",
    className: "col-span-1 row-span-1",
  },
  {
    title: "Key Decisions",
    desc: "Track critical choices made.",
    icon: "⚡",
    className: "col-span-1 row-span-1",
  },
  {
    title: "AI Meeting Assistant",
    desc: "Ask questions and get instant answers based purely on meeting context.",
    icon: "🧠",
    className: "col-span-1 sm:col-span-2 row-span-1",
    isAiAssistant: true,
  },
];

export default function BentoFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section ref={sectionRef} className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      
      {/* Subtle Animated Gradient Background Parallax Effect */}
      <motion.div 
        className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center overflow-visible"
        style={{ y: yBackground }}
      >
        <motion.div 
          className="w-full max-w-3xl h-[400px] bg-gradient-to-tr from-accent-purple/10 to-accent-blue/10 blur-[100px] rounded-[100%]"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.6, 0.8, 0.6] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
        {BENTO_ITEMS.map((item, i) => {
          const isAi = item.isAiAssistant;
          
          return (
            <motion.div
              key={item.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: 40, 
                  scale: isAi ? 0.98 : 1 
                },
                visible: (idx) => ({
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    delay: idx * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                  },
                }),
              }}
              whileHover={{ 
                scale: 1.02, 
                transition: { duration: 0.25, ease: "easeOut" } 
              }}
              className={`group relative glass-card glass-card-hover p-8 flex flex-col justify-between overflow-hidden ${item.className}`}
            >
              {/* Dynamic hover backgrounds */}
              {isAi ? (
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-blue/5 opacity-40 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              )}

              <div className="relative z-10">
                {/* Floating Icon */}
                <motion.div 
                  className="text-3xl mb-4 bg-surface w-12 h-12 flex items-center justify-center rounded-xl border border-card-border shadow-sm"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                    delay: i * 0.3 
                  }}
                >
                  {item.icon}
                </motion.div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
