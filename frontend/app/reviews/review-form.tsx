"use client"

import { useState, useRef } from "react"
import { submitReview } from "../actions/review-actions"
import { useActionState } from "react"
import { Star, Loader2, CheckCircle2, ExternalLink } from "lucide-react"

export function ReviewForm() {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [reviewLength, setReviewLength] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, isPending] = useActionState(submitReview, null)

  if (state?.success) {
    const trustpilotUrl = process.env.NEXT_PUBLIC_TRUSTPILOT_REVIEW_URL
    return (
      <div className="bg-surface/50 border border-card-border rounded-2xl p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Thank you!</h3>
        <p className="text-muted mb-8 max-w-md">
          {state.message}
        </p>
        
        {trustpilotUrl ? (
          <div className="w-full max-w-md p-6 bg-surface rounded-xl border border-card-border/50">
            <h4 className="font-medium text-foreground mb-2">Share your experience on Trustpilot</h4>
            <p className="text-sm text-muted mb-6">Want to share your experience with other MeetMindAI users?</p>
            <a 
              href={trustpilotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
            >
              Review MeetMindAI on Trustpilot
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="text-sm text-muted/50 mt-4">Trustpilot integration not configured.</div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface/30 border border-card-border rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-foreground mb-2">Write a Review</h3>
      <p className="text-muted text-sm mb-6">Please share your honest experience.</p>

      {state && !state.success && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {state.message}
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-5">
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Rating <span className="text-red-500">*</span></label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  className={`w-7 h-7 transition-all ${
                    star <= (hoverRating || rating)
                      ? "fill-accent text-accent scale-110"
                      : "fill-muted/20 text-muted/20"
                  }`}
                />
              </button>
            ))}
          </div>
          <input type="hidden" name="rating" value={rating || ""} required />
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">Review Title <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            required 
            maxLength={150}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground"
            placeholder="Sum up your experience"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="review" className="text-sm font-medium text-foreground">Review <span className="text-red-500">*</span></label>
            <span className={`text-xs ${reviewLength < 10 || reviewLength > 2000 ? "text-red-400" : "text-muted"}`}>
              {reviewLength}/2000
            </span>
          </div>
          <textarea 
            id="review" 
            name="review" 
            required 
            minLength={10}
            maxLength={2000}
            rows={5}
            onChange={(e) => setReviewLength(e.target.value.length)}
            className="w-full px-4 py-3 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground resize-y"
            placeholder="Tell us what you liked or how we can improve..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium text-foreground">Role / Company <span className="text-muted font-normal">(Optional)</span></label>
          <input 
            type="text" 
            id="role" 
            name="role" 
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-card-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground"
            placeholder="e.g. Product Manager at TechCorp"
          />
        </div>

        <div className="pt-2 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center pt-0.5">
              <input type="checkbox" name="contact_requested" className="w-4 h-4 rounded border-card-border bg-background text-accent focus:ring-accent focus:ring-offset-background" />
            </div>
            <span className="text-sm text-muted group-hover:text-foreground transition-colors">
              Would you like MeetMindAI to contact you about your feedback?
            </span>
          </label>
          
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center pt-0.5">
              <input type="checkbox" required className="w-4 h-4 rounded border-card-border bg-background text-accent focus:ring-accent focus:ring-offset-background" />
            </div>
            <span className="text-sm text-muted group-hover:text-foreground transition-colors">
              I confirm that I have personally used MeetMindAI and this review reflects my genuine experience. <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isPending || rating === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
