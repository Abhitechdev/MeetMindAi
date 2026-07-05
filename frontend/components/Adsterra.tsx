"use client";

import { useEffect, useRef } from "react";

export default function Adsterra() {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // ponytail: adsbygoogle not loaded yet — auto-ads script handles retry
    }
  }, []);

  return (
    <div className="w-full max-w-[728px] mx-auto my-8 px-4 transition-all duration-300">
      <div className="glass-card flex flex-col items-center justify-center p-4 border border-glass-border/30 bg-glass-bg/10 backdrop-blur-sm rounded-2xl relative overflow-hidden group">
        {/* Subtle background glow */}
        <div className="absolute -inset-10 bg-gradient-to-r from-accent-purple/5 via-accent-blue/5 to-accent-indigo/5 blur-xl pointer-events-none group-hover:opacity-75 transition-opacity duration-500" />
        
        {/* Advertisement Label */}
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted/40 mb-2 relative z-10 transition-colors group-hover:text-muted/60">
          Advertisement
        </span>

        {/* AdSense Ad Unit */}
        <div ref={adRef} className="w-full flex justify-center items-center min-h-[90px] relative z-10">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-8627957484050006"
            data-ad-slot="2987197934"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
}

