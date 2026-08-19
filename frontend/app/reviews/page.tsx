import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ReviewForm } from "./review-form"
import { ReviewsList } from "./reviews-list"

export const metadata: Metadata = {
  title: "MeetMindAI Reviews — Real User Experiences",
  description: "Read genuine MeetMindAI user experiences and share your own feedback."
}

export default async function ReviewsPage() {
  const supabase = await createClient()
  
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, name, rating, title, review, role, avatar_url, verified_user, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  const validReviews = reviews || []

  const totalReviews = validReviews.length
  const averageRating = totalReviews > 0 
    ? (validReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0"

  const distribution = {
    5: 0, 4: 0, 3: 0, 2: 0, 1: 0
  }
  validReviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[r.rating as keyof typeof distribution]++
    }
  })

  return (
    <div className="flex-1 py-16 lg:py-24 max-w-7xl mx-auto px-6 w-full">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
          Share Your MeetMindAI Experience
        </h1>
        <p className="text-lg text-muted">
          Your honest feedback helps us improve MeetMindAI and helps other users understand what to expect.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
        <div className="lg:col-span-4 lg:col-start-1">
          <div className="bg-surface/30 border border-card-border rounded-2xl p-6 sm:p-8 sticky top-24">
            <h2 className="text-2xl font-bold text-foreground mb-6">Review Summary</h2>
            
            <div className="flex items-end gap-4 mb-8">
              <div className="text-5xl font-bold text-foreground">{averageRating}</div>
              <div className="pb-1">
                <div className="text-sm text-muted font-medium mb-1">out of 5</div>
                <div className="text-xs text-muted/80">Based on {totalReviews} approved reviews</div>
              </div>
            </div>

            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(star => {
                const count = distribution[star as keyof typeof distribution]
                const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="w-12 text-sm font-medium text-foreground text-right">{star} star</div>
                    <div className="flex-1 h-2.5 rounded-full bg-background border border-card-border overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-500 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-10 text-xs text-muted text-right">{percentage}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <ReviewForm />
        </div>
      </div>

      <div className="border-t border-card-border pt-16 mt-8">
        <h2 className="text-3xl font-bold text-foreground mb-10 text-center">User Experiences</h2>
        <ReviewsList initialReviews={validReviews} />
      </div>
    </div>
  )
}
