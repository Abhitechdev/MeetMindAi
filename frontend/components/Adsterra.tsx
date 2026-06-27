"use client";

import Script from "next/script";

export default function Adsterra() {
  return (
    <div className="w-full max-w-[728px] mx-auto my-8 px-4 transition-all duration-300">
      <div className="glass-card flex flex-col items-center justify-center p-4 border border-glass-border/30 bg-glass-bg/10 backdrop-blur-sm rounded-2xl relative overflow-hidden group">
        {/* Subtle background glow */}
        <div className="absolute -inset-10 bg-gradient-to-r from-accent-purple/5 via-accent-blue/5 to-accent-indigo/5 blur-xl pointer-events-none group-hover:opacity-75 transition-opacity duration-500" />
        
        {/* Advertisement Label */}
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted/40 mb-2 relative z-10 transition-colors group-hover:text-muted/60">
          Advertisement
        </span>

        {/* Ad Container Placeholder */}
        <div className="w-full flex justify-center items-center min-h-[90px] relative z-10">
          <Script
            src="https://pl30099757.effectivecpmnetwork.com/6e/14/09/6e14096a8e5d84260eb5e7fdf3e90ee5.js"
            strategy="afterInteractive"
          />
        </div>
      </div>
    </div>
  );
}
