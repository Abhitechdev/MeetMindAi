"use client";

import { motion } from "framer-motion";

interface MetricCardsProps {
  duration: string;
  words: string;
  actionCount: string;
  confidence: string;
}

export default function MetricCards({ duration, words, actionCount, confidence }: MetricCardsProps) {
  const metrics = [
    { label: "Duration", value: duration, icon: "🕐" },
    { label: "Word Count", value: words, icon: "📝" },
    { label: "Action Items", value: actionCount, icon: "✅" },
    { label: "AI Confidence", value: confidence, icon: "🧠" },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {metrics.map((item, i) => (
        <motion.div
          key={item.label}
          className="glass-card p-4 flex flex-col justify-between relative overflow-hidden group"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
        >
          {/* Subtle hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="text-xl mb-3 opacity-80">{item.icon}</div>
          <div>
            <div className="text-2xl font-bold text-foreground tracking-tight">{item.value}</div>
            <div className="text-xs font-medium text-muted uppercase tracking-wider">{item.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
