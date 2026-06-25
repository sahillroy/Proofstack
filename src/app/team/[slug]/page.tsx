import { supabaseAdmin } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { ProjectCard } from "@/components/portfolio/project-card"
import { Users } from "lucide-react"
import Image from "next/image"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { JoinTeamButton } from "@/components/teams/join-team-button"

export default async function TeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params

  const { data: team } = await supabaseAdmin
    .from("teams")
    .select("*, team_members(*, profiles(*))")
    .eq("slug", slug)
    .maybeSingle()

  if (!team) notFound()

  // Fetch all submissions for all team members
  const memberIds = team.team_members.map((m: any) => m.user_id)
  
  const { data: submissions } = memberIds.length > 0 
    ? await supabaseAdmin
        .from("submissions")
        .select("*, profiles(username, full_name, avatar_url)")
        .in("user_id", memberIds)
        .order("created_at", { ascending: false })
    : { data: [] }

  const session = await getServerSession(authOptions)
  const isMember = session?.user ? memberIds.includes(session.user.id) : false

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">

      {/* Team header */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          {team.description && (
            <p className="text-muted-foreground mt-2">{team.description}</p>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
            <Users size={14} />
            {team.team_members.length} member(s)
          </div>
        </div>
        {session?.user && !isMember && (
          <JoinTeamButton teamId={team.id} />
        )}
      </div>

      {/* Member avatars */}
      <div className="flex flex-wrap gap-3 mb-10">
        {team.team_members.map((m: any) => (
          <a
            key={m.user_id}
            href={`/portfolio/${m.profiles?.username}`}
            className="flex items-center gap-2 border rounded-full px-3 py-1.5 hover:bg-muted transition-colors"
          >
            {m.profiles?.avatar_url && (
              <Image
                src={m.profiles.avatar_url}
                alt={m.profiles.full_name ?? ""}
                width={20}
                height={20}
                className="rounded-full"
              />
            )}
            <span className="text-sm">{m.profiles?.full_name ?? m.profiles?.username}</span>
          </a>
        ))}
      </div>

      {/* All submissions from all members */}
      <h2 className="text-lg font-semibold mb-4">Team projects</h2>
      <div className="flex flex-col gap-4">
        {submissions && submissions.length > 0 ? (
          submissions.map((s: any) => (
            <div key={s.id}>
              <p className="text-xs text-muted-foreground mb-1">
                by {s.profiles?.full_name ?? s.profiles?.username}
              </p>
              <ProjectCard
                project={s}
                portfolioUsername={s.profiles?.username}
              />
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            No projects from team members yet.
          </p>
        )}
      </div>
    </main>
  )
}
