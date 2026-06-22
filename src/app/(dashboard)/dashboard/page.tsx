import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { ProjectCard } from "@/components/portfolio/project-card"
import { StreakBadge } from "@/components/portfolio/streak-badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Submission } from "@/types"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")
  if (!session.user.usernameSet) redirect("/onboarding")

  const { data: submissions } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, {session.user.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s what you&apos;ve shipped recently
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StreakBadge count={session.user.streakCount} />
          <Button asChild size="sm">
            <Link href="/submit">
              <Plus size={16} className="mr-1" />
              Add project
            </Link>
          </Button>
        </div>
      </div>

      {submissions && submissions.length > 0 ? (
        <div className="flex flex-col gap-4">
          {submissions.map((s: Submission) => (
            <ProjectCard key={s.id} project={s} showActions />
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-xl p-12 text-center">
          <p className="text-muted-foreground text-sm">No projects yet.</p>
          <Button asChild className="mt-4" size="sm">
            <Link href="/submit">Submit your first project</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
