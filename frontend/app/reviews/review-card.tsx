import { Star, ShieldCheck, User } from "lucide-react"

interface ReviewCardProps {
  name: string
  rating: number
  title: string
  review: string
  role?: string | null
  avatarUrl?: string | null
  verifiedUser: boolean
  date: string
}

export function ReviewCard({ name, rating, title, review, role, avatarUrl, verifiedUser, date }: ReviewCardProps) {
  return (
    <div className="flex flex-col p-6 rounded-2xl bg-surface/50 border border-card-border hover:border-border/80 transition-all h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full object-cover border border-card-border" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
              <User className="w-5 h-5 text-accent" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              {name}
              {verifiedUser && (
                <span title="Verified MeetMindAI User" className="inline-flex text-green-500">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </h4>
            {role && <p className="text-xs text-muted mt-0.5">{role}</p>}
          </div>
        </div>
        <time className="text-xs text-muted/60">{new Date(date).toLocaleDateString()}</time>
      </div>

      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-accent text-accent" : "fill-muted/20 text-muted/20"}`}
          />
        ))}
      </div>

      <h5 className="font-medium text-foreground mb-2 text-sm">{title}</h5>
      <p className="text-sm text-muted leading-relaxed flex-grow">{review}</p>
    </div>
  )
}
