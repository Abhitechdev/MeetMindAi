"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { getMeetings } from "@/lib/api"
import GradientBackground from "../components/gradient-background"

type Meeting = {
  id: string
  title: string
  created_at: string
  duration: number
  tags: string[]
  language?: string
}

const FLAG_MAP: Record<string, string> = {
  English: "🇺🇸", Telugu: "🇮🇳", Hindi: "🇮🇳", Tamil: "🇮🇳", Kannada: "🇮🇳",
  Malayalam: "🇮🇳", Marathi: "🇮🇳", Bengali: "🇮🇳", Gujarati: "🇮🇳", Punjabi: "🇮🇳", Urdu: "🇮🇳",
  Spanish: "🇪🇸", French: "🇫🇷", German: "🇩🇪", Portuguese: "🇵🇹", Italian: "🇮🇹", Dutch: "🇳🇱",
  Japanese: "🇯🇵", Korean: "🇰🇷", Chinese: "🇨🇳",
}

export default function HistoryPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    fetchMeetings()
  }, [])

  async function fetchMeetings() {
    setLoading(true)
    try {
      const data = await getMeetings()
      setMeetings(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  async function deleteMeeting(id: string) {
    if (!confirm("Are you sure you want to delete this meeting?")) return
    await supabase.from("meetings").delete().eq("id", id)
    setMeetings(meetings.filter(m => m.id !== id))
    router.refresh()
  }

  async function deleteAllMeetings() {
    if (!confirm("Are you sure you want to delete ALL meeting history? This cannot be undone.")) return
    setLoading(true)
    
    // Note: To delete all rows, Supabase requires a filter. We can use .neq('id', '00000000-0000-0000-0000-000000000000') 
    // or since we have the list, we can delete them by IDs if RLS blocks bulk delete without filter.
    // The simplest bulk delete is to delete where id is not null.
    await supabase.from("meetings").delete().not("id", "is", null)
    
    setMeetings([])
    setLoading(false)
    router.refresh()
  }

  const filteredMeetings = useMemo(() => {
    let result = meetings
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.tags?.some(t => t.toLowerCase().includes(q))
      )
    }
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })
    return result
  }, [meetings, search, sortOrder])

  function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return m > 0 ? `${m}m ${s}s` : `${s}s`
  }

  const metrics = useMemo(() => {
    if (meetings.length === 0) return { total: 0, languagesUsed: 0, mostUsed: "N/A" }
    const total = meetings.length
    const langCounts: Record<string, number> = {}
    meetings.forEach(m => {
      const l = m.language || "English"
      langCounts[l] = (langCounts[l] || 0) + 1
    })
    const languagesUsed = Object.keys(langCounts).length
    let mostUsed = "N/A"
    let max = 0
    for (const [l, count] of Object.entries(langCounts)) {
      if (count > max) { max = count; mostUsed = l }
    }
    return { total, languagesUsed, mostUsed }
  }, [meetings])

  return (
    <main className="relative min-h-screen">
      <GradientBackground />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Meeting History</h1>
            <p className="text-muted mt-2">All your AI-analyzed conversations in one place</p>
          </div>
          {meetings.length > 0 && (
            <button
              onClick={deleteAllMeetings}
              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 text-sm font-medium transition-colors border border-red-500/20"
            >
              Delete All History
            </button>
          )}
        </div>

        {/* Dashboard Metrics */}
        {meetings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="glass-card glass-card-hover p-6">
              <p className="text-sm font-medium text-muted mb-1">Total Meetings</p>
              <p className="text-3xl font-bold text-foreground">{metrics.total}</p>
            </div>
            <div className="glass-card glass-card-hover p-6">
              <p className="text-sm font-medium text-muted mb-1">Languages Used</p>
              <p className="text-3xl font-bold text-foreground">{metrics.languagesUsed}</p>
            </div>
            <div className="glass-card glass-card-hover p-6">
              <p className="text-sm font-medium text-muted mb-1">Most Used Language</p>
              <p className="text-3xl font-bold text-foreground">
                {FLAG_MAP[metrics.mostUsed] || "🌐"} {metrics.mostUsed}
              </p>
            </div>
          </div>
        )}

        <div className="glass-card p-6 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search meetings or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-card-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted hover:text-foreground bg-surface border border-card-border rounded-lg shadow-sm hover:bg-muted/5 transition-colors"
          >
            Sort by Date: {sortOrder === "desc" ? "Newest" : "Oldest"}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted animate-pulse">Loading meetings...</div>
        ) : filteredMeetings.length === 0 ? (
          <div className="text-center py-12 glass-card">
            <p className="text-muted">No meetings found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredMeetings.map((meeting) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card glass-card-hover p-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{meeting.title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-surface text-foreground text-xs font-medium border border-card-border">
                        {FLAG_MAP[meeting.language || "English"] || "🌐"} {meeting.language || "English"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(meeting.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatDuration(meeting.duration)}
                      </span>
                    </div>
                    {meeting.tags && meeting.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {meeting.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-surface border border-card-border text-xs font-medium text-muted">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link 
                      href={`/history/${meeting.id}`}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium shadow-sm hover:bg-foreground/90 transition-colors text-center"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => deleteMeeting(meeting.id)}
                      className="p-2 rounded-md text-red-400 hover:bg-red-400/10 transition-colors"
                      aria-label="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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
