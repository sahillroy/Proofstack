import { supabaseAdmin } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { ProfileHeader } from "@/components/portfolio/profile-header"
import { ProjectCard } from "@/components/portfolio/project-card"
import { StreakBadge } from "@/components/portfolio/streak-badge"
import type { PublicProfile, Submission } from "@/types"

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single()

  if (!profile) notFound()

  const { data: submissions } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <ProfileHeader profile={profile as PublicProfile} />
      <div className="mt-3">
        <StreakBadge count={profile.streak_count ?? 0} />
      </div>

      <div className="flex flex-col gap-4 mt-8">
        {submissions && submissions.length > 0 ? (
          submissions.map((s: Submission) => (
            <ProjectCard
              key={s.id}
              project={s}
              portfolioUsername={username}
            />
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            No projects posted yet.
          </p>
        )}
      </div>
    </main>
  )
}
