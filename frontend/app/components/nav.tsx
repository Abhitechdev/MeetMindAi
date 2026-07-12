"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ThemeToggle } from "./theme-toggle"
import UpgradeModal from "./upgrade-modal"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { getUsage } from "@/lib/api"

const links = [
  { href: "/", label: "New Meeting" },
  { href: "/history", label: "History" },
  { href: "/actions", label: "Actions" },
  { href: "/decisions", label: "Decisions" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())
  const [usage, setUsage] = useState<{ plan: string; used: number; limit: number; remaining: number } | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  useEffect(() => {
    const handleOpenModal = () => setIsUpgradeModalOpen(true)
    window.addEventListener("open-upgrade-modal", handleOpenModal)
    return () => window.removeEventListener("open-upgrade-modal", handleOpenModal)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => authListener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) {
      setUsage(null)
      return
    }
    const fetchUsage = () => getUsage().then(setUsage).catch(console.error)
    fetchUsage()
    
    // ponytail: global event for lazy cross-component refresh
    window.addEventListener("usage-updated", fetchUsage)
    return () => window.removeEventListener("usage-updated", fetchUsage)
  }, [user])

  return (
    <>
      <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full border border-card-border bg-background/60 backdrop-blur-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] w-full max-w-5xl transition-all">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <img src="/logo.jpg" alt="MeetingMind AI" className="h-7 w-auto object-contain rounded-lg" />
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full ${
                      isActive ? "text-foreground" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-full bg-foreground/5 border border-card-border"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-foreground/10 animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Usage Display */}
                {usage && (
                  <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-surface border border-card-border hover:bg-muted/10 transition-colors relative group cursor-default">
                    <div className="flex flex-col items-end">
                      <div className="text-[9px] font-semibold uppercase tracking-widest text-muted mb-0.5">
                        {usage.plan} Plan
                      </div>
                      <div className="w-16 h-1 bg-background rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${usage.used >= usage.limit ? 'bg-red-500' : usage.used === usage.limit - 1 ? 'bg-amber-500' : 'bg-foreground'}`}
                          style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-xs font-bold ${usage.used >= usage.limit ? 'text-red-400' : 'text-foreground'}`}>
                        {usage.used}/{usage.limit}
                      </div>
                      {usage.plan === "Free" && (
                        <button
                          onClick={() => window.dispatchEvent(new Event("open-upgrade-modal"))}
                          className="text-[10px] font-bold uppercase tracking-wider text-blue-500 hover:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-full transition-colors"
                        >
                          Upgrade
                        </button>
                      )}
                    </div>

                    {/* Hover Dropdown/Tooltip */}
                    <div className="absolute top-full right-0 mt-3 w-56 rounded-xl border border-card-border bg-background/95 backdrop-blur-xl p-4 shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none z-50">
                      <h4 className="text-sm font-semibold text-foreground mb-1">Usage Limit</h4>
                      <p className="text-xs text-muted mb-3">You have processed {usage.used} out of {usage.limit} meetings.</p>
                      
                      {usage.used === usage.limit - 1 && (
                        <div className="rounded-lg bg-amber-500/10 px-3 py-2 border border-amber-500/20">
                          <p className="text-xs text-amber-500 font-medium">Only 1 free meeting remaining.</p>
                        </div>
                      )}
                      
                      {usage.used >= usage.limit && (
                        <div className="rounded-lg bg-red-500/10 px-3 py-2 border border-red-500/20">
                          <p className="text-xs text-red-500 font-medium">Free Plan limit reached. Upgrade to continue.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-background">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={async () => {
                    await fetch('/auth/signout', { method: 'POST' })
                    window.location.href = '/'
                  }}
                  className="hidden sm:block text-xs font-medium text-muted hover:text-foreground transition-colors ml-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium text-foreground hover:opacity-80 transition-opacity px-4 py-1.5 rounded-full hover:bg-foreground/5">
                Log in
              </Link>
            )}
            <div className="ml-1 flex items-center">
              <ThemeToggle />
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden relative ml-1">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-muted hover:text-foreground transition-colors rounded-full hover:bg-foreground/5"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-card-border bg-background/95 backdrop-blur-2xl p-2 shadow-2xl z-50 flex flex-col gap-1"
                  >
                    {usage && (
                      <div className="border-b border-card-border mb-1 pb-3 px-3 pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{usage.plan} Plan</span>
                          <span className={`text-xs font-bold ${usage.used >= usage.limit ? 'text-red-400' : 'text-foreground'}`}>
                            {usage.used} / {usage.limit}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden shadow-inner mb-3">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${usage.used >= usage.limit ? 'bg-red-500' : usage.used === usage.limit - 1 ? 'bg-amber-500' : 'bg-foreground'}`}
                            style={{ width: `${Math.min(100, (usage.used / usage.limit) * 100)}%` }}
                          />
                        </div>
                        {usage.plan === "Free" && (
                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              window.dispatchEvent(new Event("open-upgrade-modal"));
                            }}
                            className="w-full text-xs font-bold uppercase tracking-wider text-blue-500 hover:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-2 rounded-lg transition-colors"
                          >
                            Upgrade Plan
                          </button>
                        )}
                      </div>
                    )}
                    {links.map((link) => {
                      const isActive = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-4 py-2.5 text-sm font-medium transition-colors rounded-xl ${
                            isActive ? "text-foreground bg-foreground/5" : "text-muted hover:text-foreground hover:bg-foreground/5"
                          }`}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
