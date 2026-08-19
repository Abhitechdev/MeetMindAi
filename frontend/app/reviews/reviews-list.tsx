"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { ReviewCard } from "./review-card"

type Review = {
  id: string
  name: string
  rating: number
  title: string
  review: string
  role: string | null
  avatar_url: string | null
  verified_user: boolean
  created_at: string
}

export function ReviewsList({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'reviews',
          filter: "status=eq.approved"
        },
        (payload) => {
          // If a review gets approved, add it or update it
          setReviews((current) => {
            const newReview = payload.new as Review
            const exists = current.find((r) => r.id === newReview.id)
            if (exists) {
              return current.map((r) => r.id === newReview.id ? newReview : r)
            }
            return [newReview, ...current]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'reviews',
        },
        (payload) => {
          setReviews((current) => current.filter((r) => r.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (reviews.length === 0) {
    return (
      <div className="text-center p-12 bg-surface/30 border border-card-border rounded-2xl">
        <p className="text-muted text-lg">Be the first to share your MeetMindAI experience.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          name={review.name}
          rating={review.rating}
          title={review.title}
          review={review.review}
          role={review.role}
          avatarUrl={review.avatar_url}
          verifiedUser={review.verified_user}
          date={review.created_at}
        />
      ))}
    </div>
  )
}
