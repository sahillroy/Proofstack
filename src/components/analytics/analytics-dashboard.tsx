"use client"
import { Badge } from "@/components/ui/badge"
import { Flame, Eye, Sparkles, TrendingUp } from "lucide-react"
import { formatDate } from "@/lib/utils"

type SubmissionWithCounts = {
  id: string
  title: string
  type: string
  created_at: string
  generated_posts: { count: number }[] | null
  portfolio_views: { count: number }[] | null
}

type Props = {
  submissions: SubmissionWithCounts[]
  totalGenerations: number
  totalViews: number
  streakCount: number
  username: string
}

export function AnalyticsDashboard({
  submissions,
  totalGenerations,
  totalViews,
  streakCount,
  username,
}: Props) {
  const stats = [
    {
      label: "Portfolio views",
      value: totalViews,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Content generated",
      value: totalGenerations,
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
    {
      label: "Projects logged",
      value: submissions.length,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Week streak",
      value: streakCount,
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950",
    },
  ]

  return (
    <div className="space-y-8">

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="border rounded-xl p-5 flex flex-col gap-3"
          >
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio link */}
      <div className="border rounded-xl p-5">
        <p className="text-sm font-medium mb-1">Your public portfolio</p>
        <a
          href={`/portfolio/${username}`}
          target="_blank"
          className="text-sm text-primary hover:underline font-mono"
        >
          {typeof window !== "undefined" ? window.location.origin : ""}/portfolio/{username}
        </a>
      </div>

      {/* Per-project table */}
      <div>
        <h2 className="text-sm font-medium mb-3">Per project breakdown</h2>
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Views</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Generated</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                    {s.title}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={s.type === "project" ? "default" : "secondary"}>
                      {s.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.portfolio_views && s.portfolio_views[0] ? (s.portfolio_views[0] as any).count ?? 0 : 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.generated_posts && s.generated_posts[0] ? (s.generated_posts[0] as any).count ?? 0 : 0}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatDate(s.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {submissions.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No projects yet. Submit your first project to see analytics.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
