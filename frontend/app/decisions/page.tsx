"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getDecisions } from "@/lib/api"
import GradientBackground from "../components/gradient-background"

type Decision = {
  id: string
  decision_text: string
  status: string
  created_at: string
  meetings: { title: string }
}

let cachedDecisions: Decision[] | null = null;

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>(cachedDecisions || [])
  const [loading, setLoading] = useState(!cachedDecisions)

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDecisions() {
      try {
        const data = await getDecisions(controller.signal);
        cachedDecisions = data;
        setDecisions(data);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDecisions();

    return () => controller.abort();
  }, [])

  return (
    <main className="relative min-h-screen">
      <GradientBackground />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Decision Center</h1>
            <p className="text-muted mt-2">Log of key decisions made across all meetings</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted animate-pulse">Loading decisions...</div>
        ) : decisions.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <p className="text-muted">No decisions found.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {decisions.map((decision) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card glass-card-hover p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <p className="text-base font-medium text-foreground">
                      {decision.decision_text}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span className="font-medium">{decision.meetings?.title || "Unknown"}</span>
                      <span>•</span>
                      <span>{new Date(decision.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 pt-2 sm:pt-0">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface border border-card-border text-foreground shadow-sm">
                      {decision.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  )
}
