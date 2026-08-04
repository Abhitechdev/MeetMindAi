"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { getDecisions } from "@/lib/api"
import GradientBackground from "../components/gradient-background"

type Decision = {
  id: string
  decision_text: string
  status: "proposed" | "approved" | string
  created_at: string
  meetings: { title: string }
}

let cachedDecisions: Decision[] | null = null;

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>(cachedDecisions || [])
  const [loading, setLoading] = useState(!cachedDecisions)
  const [filter, setFilter] = useState<"all" | "approved" | "proposed">("all")
  const [supabase] = useState(() => createClient())
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDecisions() {
      try {
        const data = await getDecisions(controller.signal);
        cachedDecisions = data;
        setDecisions(data);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== "AbortError") {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDecisions();

    return () => controller.abort();
  }, [])

  async function toggleDecisionStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "approved" ? "proposed" : "approved"
    
    // Optimistic update
    setDecisions(decisions.map(d => d.id === id ? { ...d, status: newStatus } : d))
    
    setToast(newStatus === "approved" ? "Decision approved" : "Decision moved back to proposed")
    setTimeout(() => setToast(null), 3000)

    try {
      await supabase.from("decisions").update({ status: newStatus }).eq("id", id)
    } catch (err) {
      console.error("Failed to update decision status:", err)
    }
  }

  const approvedDecisions = decisions.filter(d => d.status === "approved")
  const proposedDecisions = decisions.filter(d => d.status !== "approved")

  const renderDecisionCard = (decision: Decision) => {
    const isApproved = decision.status === "approved"

    return (
      <motion.div
        key={decision.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`glass-card glass-card-hover p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-all ${
          isApproved ? "border-emerald-500/20 bg-emerald-500/5 shadow-sm" : "border-card-border/80"
        }`}
      >
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-base font-semibold text-foreground leading-snug">
            {decision.decision_text}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>Meeting: <span className="font-medium text-foreground">{decision.meetings?.title || "Unknown"}</span></span>
            <span>•</span>
            <span>{new Date(decision.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex-shrink-0 pt-2 sm:pt-0 self-end sm:self-center">
          <button
            onClick={() => toggleDecisionStatus(decision.id, decision.status)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-sm ${
              isApproved
                ? "bg-emerald-500/10 hover:bg-amber-500/10 text-emerald-400 hover:text-amber-400 border border-emerald-500/20 hover:border-amber-500/20"
                : "bg-gradient-to-r from-accent-purple to-accent-blue text-white hover:scale-[1.02] shadow-md"
            }`}
            title={isApproved ? "Click to undo approval" : "Click to approve decision"}
          >
            {isApproved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Approved</span>
                <span className="text-[10px] opacity-70 ml-1 font-normal">(Undo)</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <main className="relative min-h-screen">
      <GradientBackground />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Decision <span className="bg-gradient-to-r from-accent-purple via-foreground to-accent-blue bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-muted mt-2 text-sm md:text-base">Log and audit key decisions finalized across all meetings</p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-surface/80 border border-card-border inline-flex rounded-xl shadow-sm backdrop-blur-md">
          {[
            { id: "all", label: `All (${decisions.length})` },
            { id: "approved", label: `Approved (${approvedDecisions.length})` },
            { id: "proposed", label: `Proposed (${proposedDecisions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as "all" | "approved" | "proposed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.id 
                  ? "bg-foreground text-background shadow-md font-semibold" 
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted animate-pulse">Loading decisions...</div>
        ) : decisions.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <p className="text-muted">No decisions recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {/* All View: Grouped into Approved and Proposed */}
              {filter === "all" && (
                <>
                  {approvedDecisions.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider px-1">
                        Approved Decisions ({approvedDecisions.length})
                      </h2>
                      <div className="grid gap-3">
                        {approvedDecisions.map(renderDecisionCard)}
                      </div>
                    </div>
                  )}

                  {proposedDecisions.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-card-border/50">
                      <h2 className="text-xs font-semibold text-accent-purple uppercase tracking-wider px-1">
                        Proposed Decisions ({proposedDecisions.length})
                      </h2>
                      <div className="grid gap-3">
                        {proposedDecisions.map(renderDecisionCard)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Approved Only View */}
              {filter === "approved" && (
                approvedDecisions.length > 0 ? (
                  <div className="grid gap-3">
                    {approvedDecisions.map(renderDecisionCard)}
                  </div>
                ) : (
                  <div className="text-center py-16 glass-card rounded-2xl">
                    <p className="text-muted">No approved decisions yet.</p>
                  </div>
                )
              )}

              {/* Proposed Only View */}
              {filter === "proposed" && (
                proposedDecisions.length > 0 ? (
                  <div className="grid gap-3">
                    {proposedDecisions.map(renderDecisionCard)}
                  </div>
                ) : (
                  <div className="text-center py-16 glass-card rounded-2xl">
                    <p className="text-muted">No pending proposed decisions!</p>
                  </div>
                )
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 glass-card px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-500/30 bg-surface/90 backdrop-blur-xl"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-foreground">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
