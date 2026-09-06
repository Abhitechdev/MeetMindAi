"use client";

import { useEffect } from "react";
import Link from "next/link";
import GradientBackground from "./components/gradient-background";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error:", error);
  }, [error]);

  return (
    <main className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <GradientBackground />

      <div className="relative z-10 max-w-lg mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-6 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>Something went wrong</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Unexpected Error
        </h1>

        <p className="text-sm sm:text-base text-muted mb-8 leading-relaxed max-w-md mx-auto">
          An unexpected issue occurred while loading this page. You can try refreshing or returning to the homepage.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-3 text-sm font-semibold text-white shadow-md hover:scale-[1.02] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-card-border bg-surface/60 hover:bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all"
          >
            <Home className="w-4 h-4 text-muted" />
            <span>Go to Homepage</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
