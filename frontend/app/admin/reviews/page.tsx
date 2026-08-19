import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminReviewsClient } from "./admin-reviews-client"

export const metadata: Metadata = {
  title: "Admin - Reviews | MeetMindAI",
  robots: "noindex, nofollow"
}

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check admin authorization
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .single()

  if (!admin) {
    // Unauthorized user trying to access admin dashboard
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-red-500 mb-2">Unauthorized</h1>
          <p className="text-muted text-sm">
            You do not have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    )
  }

  // Fetch all reviews for admin
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, review_private_data(email)")
    .order("created_at", { ascending: false })

  // Transform data to flatten email
  const formattedReviews = (reviews || []).map(r => ({
    ...r,
    email: Array.isArray(r.review_private_data) ? r.review_private_data[0]?.email || "Unknown" : r.review_private_data?.email || "Unknown"
  }))

  return (
    <div className="flex-1 py-12 max-w-6xl mx-auto px-6 w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Reviews Moderation
        </h1>
        <p className="text-muted text-sm">
          Approve, reject, or delete user reviews.
        </p>
      </div>

      <AdminReviewsClient initialReviews={formattedReviews} />
    </div>
  )
}
