import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  // Fetch submissions with view counts and generation counts
  const { data: submissions } = await supabaseAdmin
    .from("submissions")
    .select(`
      id,
      title,
      type,
      created_at,
      generated_posts(count),
      portfolio_views(count)
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  // Fetch total stats
  const { count: totalGenerations } = await supabaseAdmin
    .from("generated_posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)

  const { count: totalViews } = await supabaseAdmin
    .from("portfolio_views")
    .select("*", { count: "exact", head: true })
    .eq("username", session.user.username ?? "")

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          How your portfolio is performing
        </p>
      </div>
      <AnalyticsDashboard
        submissions={(submissions as any) ?? []}
        totalGenerations={totalGenerations ?? 0}
        totalViews={totalViews ?? 0}
        streakCount={session.user.streakCount ?? 0}
        username={session.user.username ?? ""}
      />
    </div>
  )
}
