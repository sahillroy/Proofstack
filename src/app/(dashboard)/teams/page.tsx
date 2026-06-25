import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { TeamDashboard } from "@/components/teams/team-dashboard"

export default async function TeamsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  // Teams created by user
  const { data: myTeams } = await supabaseAdmin
    .from("teams")
    .select("*, team_members(count)")
    .eq("created_by", session.user.id)
    .order("created_at", { ascending: false })

  // Teams user is a member of
  const { data: memberTeams } = await supabaseAdmin
    .from("team_members")
    .select("*, teams(*)")
    .eq("user_id", session.user.id)
    .order("joined_at", { ascending: false })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create a team for your bootcamp, college, or study group
        </p>
      </div>
      <TeamDashboard
        myTeams={(myTeams as any) ?? []}
        memberTeams={(memberTeams as any) ?? []}
        userId={session.user.id}
      />
    </div>
  )
}
