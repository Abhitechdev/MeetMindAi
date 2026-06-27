"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getMeeting } from "@/lib/api"
import type { ProcessingResponse } from "@/lib/types"
import GradientBackground from "@/app/components/gradient-background"
import TranscriptViewer from "@/app/components/transcript-viewer"
import SummaryViewer from "@/app/components/summary-viewer"
import { motion } from "framer-motion"

export default function MeetingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [meeting, setMeeting] = useState<ProcessingResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Preserve scroll position by scrolling to top explicitly when the component mounts.
    window.scrollTo(0, 0)
    
    async function fetchMeeting() {
      try {
        const data = await getMeeting(id)
        setMeeting(data)
      } catch (err: any) {
        setError(err.message || "Failed to load meeting details")
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchMeeting()
    }
  }, [id])

  return (
    <main className="relative min-h-screen">
      <GradientBackground />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to History
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          </div>
        ) : error ? (
          <div className="glass-card p-12 text-center">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error</h2>
            <p className="text-muted mb-6">{error}</p>
            <button
              onClick={() => { setLoading(true); setError(null); getMeeting(id).then(setMeeting).catch(e => setError(e.message)).finally(() => setLoading(false)); }}
              className="px-4 py-2 bg-foreground text-background rounded-md text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : meeting ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{meeting.title}</h1>
              <p className="text-muted mt-2">
                Processed Meeting • Language: {meeting.language || "English"}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SummaryViewer
                executiveSummary={meeting.executiveSummary}
                keyDecisions={meeting.decisions}
                actionItems={meeting.actionItems}
                nextSteps={meeting.nextSteps}
              />
              <TranscriptViewer
                transcript={meeting.transcript}
                segments={meeting.segments || []}
                language={meeting.language}
              />
            </div>
          </motion.div>
        ) : null}
      </div>
    </main>
  )
}
