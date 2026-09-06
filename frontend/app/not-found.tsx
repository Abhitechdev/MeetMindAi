import Link from "next/link";
import GradientBackground from "./components/gradient-background";
import { ArrowLeft, Home, BookOpen, LifeBuoy, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <GradientBackground />

      <div className="relative z-10 max-w-xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent-purple/10 text-accent-purple border border-accent-purple/20 mb-6 shadow-sm">
          <span>Error 404</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-4">
          Page Not Found
        </h1>

        <p className="text-base sm:text-lg text-muted mb-10 leading-relaxed max-w-md mx-auto">
          We couldn&apos;t find the page you were looking for. It may have moved, been renamed, or does not exist.
        </p>

        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-card-border bg-surface/40 mb-8 text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-4">
            Helpful Destinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 p-3 rounded-xl border border-card-border/60 hover:border-accent-purple/40 hover:bg-surface transition-all text-sm text-foreground group"
            >
              <Home className="w-4 h-4 text-accent-purple group-hover:scale-110 transition-transform" />
              <span>Home Dashboard</span>
            </Link>

            <Link
              href="/blog"
              className="flex items-center gap-3 p-3 rounded-xl border border-card-border/60 hover:border-accent-blue/40 hover:bg-surface transition-all text-sm text-foreground group"
            >
              <BookOpen className="w-4 h-4 text-accent-blue group-hover:scale-110 transition-transform" />
              <span>Articles & Guides</span>
            </Link>

            <Link
              href="/help-center"
              className="flex items-center gap-3 p-3 rounded-xl border border-card-border/60 hover:border-emerald-500/40 hover:bg-surface transition-all text-sm text-foreground group"
            >
              <LifeBuoy className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Help Center & FAQ</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-3 p-3 rounded-xl border border-card-border/60 hover:border-amber-500/40 hover:bg-surface transition-all text-sm text-foreground group"
            >
              <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Contact Support</span>
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-3 text-sm font-semibold text-white shadow-md hover:scale-[1.02] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </main>
  );
}
