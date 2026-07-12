"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase"
import { getMeetings } from "@/lib/api"
import GradientBackground from "../components/gradient-background"
import { Search, Calendar, Clock, Trash2, ArrowUpDown } from "lucide-react"

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

let cachedMeetings: Meeting[] | null = null;

export default function HistoryPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(cachedMeetings || [])
  const [loading, setLoading] = useState(!cachedMeetings)
  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMeetings() {
      try {
        const data = await getMeetings(controller.signal);
        cachedMeetings = data;
        setMeetings(data);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMeetings();

    return () => controller.abort();
  }, [])

  async function deleteMeeting(id: string) {
    if (!confirm("Are you sure you want to delete this meeting?")) return
    await supabase.from("meetings").delete().eq("id", id)
    setMeetings(meetings.filter(m => m.id !== id))
    router.refresh()
  }

  async function deleteAllMeetings() {
    if (!confirm("Are you sure you want to delete ALL meeting history? This cannot be undone.")) return
    setLoading(true)
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
    <main className="relative min-h-screen pt-24 pb-16">
      <GradientBackground />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-semibold tracking-tighter text-foreground">Meeting History</h1>
            <p className="text-lg text-muted mt-2">All your AI-analyzed conversations in one place.</p>
          </div>
          {meetings.length > 0 && (
            <button
              onClick={deleteAllMeetings}
              className="px-5 py-2.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 text-sm font-semibold transition-colors border border-red-500/20"
            >
              Delete All History
            </button>
          )}
        </div>

        {/* Dashboard Metrics */}
        {meetings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="glass-card glass-card-hover p-6 rounded-2xl">
              <p className="text-sm font-medium text-muted mb-2">Total Meetings</p>
              <p className="text-4xl font-bold tracking-tight text-foreground">{metrics.total}</p>
            </div>
            <div className="glass-card glass-card-hover p-6 rounded-2xl">
              <p className="text-sm font-medium text-muted mb-2">Languages Used</p>
              <p className="text-4xl font-bold tracking-tight text-foreground">{metrics.languagesUsed}</p>
            </div>
            <div className="glass-card glass-card-hover p-6 rounded-2xl">
              <p className="text-sm font-medium text-muted mb-2">Most Used Language</p>
              <p className="text-4xl font-bold tracking-tight text-foreground">
                {FLAG_MAP[metrics.mostUsed] || "🌐"} {metrics.mostUsed}
              </p>
            </div>
          </div>
        )}

        <div className="glass-card p-4 rounded-2xl mb-10 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search meetings or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-card-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
            />
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-muted hover:text-foreground bg-surface border border-card-border rounded-xl shadow-sm hover:bg-muted/5 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort by Date: {sortOrder === "desc" ? "Newest" : "Oldest"}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted animate-pulse font-medium">Loading history...</div>
        ) : filteredMeetings.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-2xl">
            <p className="text-muted text-lg">No meetings found.</p>
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
                  className="glass-card glass-card-hover p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground">{meeting.title}</h3>
                      <span className="px-2.5 py-1 rounded-md bg-surface text-foreground text-xs font-semibold border border-card-border">
                        {FLAG_MAP[meeting.language || "English"] || "🌐"} {meeting.language || "English"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(meeting.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formatDuration(meeting.duration)}
                      </span>
                    </div>
                    {meeting.tags && meeting.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {meeting.tags.map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-surface border border-card-border text-xs font-medium text-muted">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link 
                      href={`/history/${meeting.id}`}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold shadow-sm hover:bg-foreground/90 transition-colors text-center"
                    >
                      Open Summary
                    </Link>
                    <button
                      onClick={() => deleteMeeting(meeting.id)}
                      className="p-2.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
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
