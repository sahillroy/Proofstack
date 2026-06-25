import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(60),
  description: z.string().max(200).optional(),
})

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createTeamSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    )
  }

  const { name, description } = parsed.data
  const slug = slugify(name)

  // Check slug not taken
  const { data: existing } = await supabaseAdmin
    .from("teams")
    .select("id")
    .eq("slug", slug)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: "A team with this name already exists. Try a different name." },
      { status: 409 }
    )
  }

  // Create team
  const { data: team, error } = await supabaseAdmin
    .from("teams")
    .insert({ name, slug, description: description ?? null, created_by: session.user.id })
    .select("id, slug")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-add creator as admin member
  await supabaseAdmin.from("team_members").insert({
    team_id: team.id,
    user_id: session.user.id,
    role: "admin",
  })

  return NextResponse.json({ slug: team.slug })
}
