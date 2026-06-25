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

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    fetchActions()
  }, [])

  async function fetchActions() {
    setLoading(true)
    try {
      const data = await getActions()
      setActions(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "pending" ? "completed" : "pending"
    // Optimistic update
    setActions(actions.map(a => a.id === id ? { ...a, status: newStatus as any } : a))
    
    await supabase.from("action_items").update({ status: newStatus }).eq("id", id)
  }

  const filteredActions = actions.filter(a => {
    if (filter === "all") return true
    return a.status === filter
  })

  return (
    <main className="relative min-h-screen">
      <GradientBackground />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Action Center</h1>
            <p className="text-muted mt-2">Track and manage tasks from all meetings</p>
          </div>
        </div>

        <div className="flex gap-2 mb-8 p-1 glass-card inline-flex rounded-lg">
          {(["all", "pending", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-foreground/10 text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted animate-pulse">Loading actions...</div>
        ) : filteredActions.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <p className="text-muted">No action items found.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {filteredActions.map((action) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`glass-card p-4 flex gap-4 items-start transition-opacity ${
                    action.status === "completed" ? "opacity-60 hover:opacity-100" : ""
                  }`}
                >
                  <button
                    onClick={() => toggleStatus(action.id, action.status)}
                    className={`mt-1 w-5 h-5 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${
                      action.status === "completed" 
                        ? "bg-foreground border-foreground text-background" 
                        : "border-muted hover:border-foreground"
                    }`}
                  >
                    {action.status === "completed" && (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <div className="space-y-1">
                    <p className={`text-base font-medium ${action.status === "completed" ? "line-through text-muted" : "text-foreground"}`}>
                      {action.action_text}
                    </p>
                    <p className="text-xs text-muted">
                      From: <span className="font-medium">{action.meetings?.title || "Unknown"}</span> • {new Date(action.created_at).toLocaleDateString()}
                    </p>
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
