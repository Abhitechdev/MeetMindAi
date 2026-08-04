"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { getActions } from "@/lib/api"
import GradientBackground from "../components/gradient-background"

type ActionItem = {
  id: string
  action_text: string
  status: "pending" | "completed"
  created_at: string
  meetings: { title: string }
}

let cachedActions: ActionItem[] | null = null;

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>(cachedActions || [])
  const [loading, setLoading] = useState(!cachedActions)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [supabase] = useState(() => createClient())
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController();

    async function fetchActions() {
      try {
        const data = await getActions(controller.signal);
        cachedActions = data;
        setActions(data);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== "AbortError") {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchActions();

    return () => controller.abort();
  }, [])

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "pending" ? "completed" : "pending"
    // Optimistic update
    setActions(actions.map(a => a.id === id ? { ...a, status: newStatus as ActionItem["status"] } : a))
    
    // ponytail: zero-dependency toast notification
    setToast(newStatus === "completed" ? "Task moved to Completed section" : "Task moved to Pending section")
    setTimeout(() => setToast(null), 3000)
    
    await supabase.from("action_items").update({ status: newStatus }).eq("id", id)
  }

  const pendingActions = actions.filter(a => a.status === "pending")
  const completedActions = actions.filter(a => a.status === "completed")

  const renderActionCard = (action: ActionItem) => (
    <motion.div
      key={action.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`glass-card glass-card-hover p-5 flex gap-4 items-start transition-all ${
        action.status === "completed" ? "opacity-75 bg-surface/30" : ""
      }`}
    >
      <button
        onClick={() => toggleStatus(action.id, action.status)}
        className={`mt-1 w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${
          action.status === "completed" 
            ? "bg-foreground border-foreground text-background shadow-sm" 
            : "border-card-border bg-surface hover:border-foreground"
        }`}
        aria-label={action.status === "completed" ? "Mark as pending" : "Mark as completed"}
      >
        {action.status === "completed" && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      <div className="space-y-1 min-w-0 flex-1">
        <p className={`text-base font-medium transition-all ${
          action.status === "completed" ? "line-through text-muted/60" : "text-foreground"
        }`}>
          {action.action_text}
        </p>
        <p className="text-xs text-muted">
          From: <span className="font-medium">{action.meetings?.title || "Unknown"}</span> • {new Date(action.created_at).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  )

  return (
    <main className="relative min-h-screen">
      <GradientBackground />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Action <span className="bg-gradient-to-r from-accent-purple via-foreground to-accent-blue bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-muted mt-2 text-sm md:text-base">Track and manage tasks from all meetings</p>
        </div>

        <div className="flex gap-2 mb-8 p-1 bg-surface/80 border border-card-border inline-flex rounded-xl shadow-sm backdrop-blur-md">
          {[
            { id: "all", label: `All (${actions.length})` },
            { id: "pending", label: `Pending (${pendingActions.length})` },
            { id: "completed", label: `Completed (${completedActions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as "all" | "pending" | "completed")}
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
          <div className="text-center py-12 text-muted animate-pulse">Loading actions...</div>
        ) : actions.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <p className="text-muted">No action items found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {/* All View: Grouped into Pending Tasks and Completed Tasks */}
              {filter === "all" && (
                <>
                  {pendingActions.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-1">
                        Pending Tasks ({pendingActions.length})
                      </h2>
                      <div className="grid gap-3">
                        {pendingActions.map(renderActionCard)}
                      </div>
                    </div>
                  )}

                  {completedActions.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-card-border/50">
                      <h2 className="text-xs font-semibold text-muted uppercase tracking-wider px-1 flex items-center justify-between">
                        <span>Completed ({completedActions.length})</span>
                      </h2>
                      <div className="grid gap-3">
                        {completedActions.map(renderActionCard)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Pending Only View */}
              {filter === "pending" && (
                pendingActions.length > 0 ? (
                  <div className="grid gap-3">
                    {pendingActions.map(renderActionCard)}
                  </div>
                ) : (
                  <div className="text-center py-12 glass-card">
                    <p className="text-muted">No pending tasks remaining!</p>
                  </div>
                )
              )}

              {/* Completed Only View */}
              {filter === "completed" && (
                completedActions.length > 0 ? (
                  <div className="grid gap-3">
                    {completedActions.map(renderActionCard)}
                  </div>
                ) : (
                  <div className="text-center py-12 glass-card">
                    <p className="text-muted">No completed tasks yet.</p>
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
            className="fixed bottom-8 left-1/2 z-50 glass-card px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-accent-purple/30 bg-surface/90 backdrop-blur-xl"
          >
            <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
            <span className="text-sm font-medium text-foreground">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
