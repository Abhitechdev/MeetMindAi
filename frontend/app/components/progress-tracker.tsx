"use client";

import { motion } from "framer-motion";

const STEPS = [
  { label: "Upload", icon: "↑" },
  { label: "Transcribe", icon: "🎙" },
  { label: "Analyze", icon: "✦" },
  { label: "Complete", icon: "✓" },
];

// ponytail: flat map, no enum needed
const STATUS_TO_STEP: Record<string, number> = {
  uploading: 0,
  transcribing: 1,
  summarizing: 2,
  complete: 3,
};

export default function ProgressTracker({ status }: { status: string }) {
  const currentStep = STATUS_TO_STEP[status] ?? 0;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;

        return (
          <div key={step.label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <motion.div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                  done || active
                    ? "text-white"
                    : "bg-surface border border-glass-border text-muted"
                }`}
                style={
                  done || active
                    ? { background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }
                    : undefined
                }
                animate={active ? { scale: [1, 1.1, 1] } : {}}
                transition={
                  active
                    ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    : {}
                }
              >
                {done ? "✓" : step.icon}
              </motion.div>
              <span
                className={`text-xs font-medium ${
                  active || done ? "text-foreground" : "text-muted"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-px mb-5 rounded-full transition-colors duration-500 ${
                  i < currentStep ? "bg-accent-purple" : "bg-glass-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
