"use client"

import { useState } from "react"
import { updateReviewStatus, deleteReview } from "../../actions/review-actions"
import { Check, X, Trash2 } from "lucide-react"

type Review = {
  id: string
  name: string
  email: string
  rating: number
  title: string
  review: string
  status: string
  created_at: string
}

export function AdminReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const filteredReviews = initialReviews.filter(r => activeTab === "all" || r.status === activeTab)

  const pendingCount = initialReviews.filter(r => r.status === "pending").length
  const approvedCount = initialReviews.filter(r => r.status === "approved").length
  const rejectedCount = initialReviews.filter(r => r.status === "rejected").length
  const totalCount = initialReviews.length
  
  const avgRating = approvedCount > 0 
    ? (initialReviews.filter(r => r.status === "approved").reduce((acc, r) => acc + r.rating, 0) / approvedCount).toFixed(1)
    : "0.0"

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    setIsProcessing(id)
    await updateReviewStatus(id, status)
    setIsProcessing(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      setIsProcessing(id)
      await deleteReview(id)
      setIsProcessing(null)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface border border-card-border p-4 rounded-xl">
          <p className="text-xs text-muted mb-1 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-foreground">{totalCount}</p>
        </div>
        <div className="bg-surface border border-card-border p-4 rounded-xl">
          <p className="text-xs text-muted mb-1 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
        </div>
        <div className="bg-surface border border-card-border p-4 rounded-xl">
          <p className="text-xs text-muted mb-1 uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-bold text-green-500">{approvedCount}</p>
        </div>
        <div className="bg-surface border border-card-border p-4 rounded-xl">
          <p className="text-xs text-muted mb-1 uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{rejectedCount}</p>
        </div>
        <div className="bg-surface border border-card-border p-4 rounded-xl">
          <p className="text-xs text-muted mb-1 uppercase tracking-wider">Avg Rating</p>
          <p className="text-2xl font-bold text-accent">{avgRating}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-card-border">
        {["all", "pending", "approved", "rejected"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "all" | "pending" | "approved" | "rejected")}
            className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab 
                ? "border-accent text-accent" 
                : "border-transparent text-muted hover:text-foreground hover:border-card-border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-surface/30 border border-card-border rounded-xl">
            <p className="text-muted">No {activeTab !== "all" ? activeTab : ""} reviews found.</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="bg-surface border border-card-border p-5 rounded-xl flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-accent">{review.rating}</span>
                    <span className="text-xs text-muted">/ 5</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    review.status === "approved" ? "bg-green-500/10 text-green-500" :
                    review.status === "rejected" ? "bg-red-500/10 text-red-500" :
                    "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {review.status}
                  </span>
                  <span className="text-xs text-muted">{new Date(review.created_at).toLocaleString()}</span>
                </div>
                
                <h4 className="font-semibold text-foreground">{review.title}</h4>
                <p className="text-sm text-muted/90">{review.review}</p>
                
                <div className="pt-2 text-xs text-muted/60 flex items-center gap-4">
                  <span>{review.name}</span>
                  <span>{review.email}</span>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                {review.status !== "approved" && (
                  <button 
                    onClick={() => handleStatusUpdate(review.id, "approved")}
                    disabled={isProcessing === review.id}
                    className="flex-1 md:flex-none flex items-center gap-2 justify-center px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                )}
                {review.status !== "rejected" && (
                  <button 
                    onClick={() => handleStatusUpdate(review.id, "rejected")}
                    disabled={isProcessing === review.id}
                    className="flex-1 md:flex-none flex items-center gap-2 justify-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(review.id)}
                  disabled={isProcessing === review.id}
                  className="flex-1 md:flex-none flex items-center gap-2 justify-center px-4 py-2 border border-card-border hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 text-muted rounded-lg transition-all text-sm font-medium disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
