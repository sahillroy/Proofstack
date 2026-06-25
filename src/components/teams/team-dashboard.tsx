"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Copy, Check, ExternalLink } from "lucide-react"
import Link from "next/link"

type Team = {
  id: string
  name: string
  slug: string
  description: string | null
  team_members: { count: number }[]
}

type MemberTeam = {
  role: string
  teams: Team
}

type Props = {
  myTeams: Team[]
  memberTeams: MemberTeam[]
  userId: string
}

export function TeamDashboard({ myTeams, memberTeams, userId }: Props) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  async function createTeam() {
    if (!name.trim()) return
    setLoading(true)
    setError(null)

    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), description: description.trim() }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? "Failed to create team")
      setLoading(false)
      return
    }

    window.location.reload()
  }

  function copyInviteLink(slug: string) {
    const url = `${window.location.origin}/team/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  const allTeams = [
    ...myTeams.map((t) => ({ ...t, role: "admin" as const })),
    ...memberTeams.map((m) => ({ ...m.teams, role: m.role as "member" })),
  ]

  return (
    <div className="space-y-6">

      {/* Team list */}
      {allTeams.length > 0 ? (
        <div className="flex flex-col gap-3">
          {allTeams.map((team) => (
            <div key={team.id} className="border rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{team.name}</span>
                    <Badge variant={team.role === "admin" ? "default" : "secondary"}>
                      {team.role}
                    </Badge>
                  </div>
                  {team.description && (
                    <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Users size={12} />
                    {team.team_members?.[0]?.count ?? 1} member(s)
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyInviteLink(team.slug)}
                    className="gap-1"
                  >
                    {copiedSlug === team.slug ? <Check size={13} /> : <Copy size={13} />}
                    {copiedSlug === team.slug ? "Copied!" : "Invite link"}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/team/${team.slug}`} className="gap-1">
                      <ExternalLink size={13} /> View
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm border rounded-xl border-dashed">
          You are not in any teams yet. Create a team below to get started!
        </div>
      )}

      {/* Create team */}
      {!creating ? (
        <Button
          variant="outline"
          onClick={() => setCreating(true)}
          className="gap-2"
        >
          <Plus size={16} /> Create a team
        </Button>
      ) : (
        <div className="border rounded-xl p-5 space-y-4">
          <h3 className="font-medium">New team</h3>
          <div>
            <Label htmlFor="team-name">Team name</Label>
            <Input
              id="team-name"
              placeholder="e.g. VJTI Web Dev Batch 2026"
              className="mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {name && (
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                URL: /team/{slugify(name)}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="team-desc">Description (optional)</Label>
            <Input
              id="team-desc"
              placeholder="e.g. Study group for full-stack web development"
              className="mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex gap-2">
            <Button onClick={createTeam} disabled={loading || !name.trim()} size="sm">
              {loading ? "Creating..." : "Create team"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreating(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
