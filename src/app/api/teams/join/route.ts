import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

const joinTeamSchema = z.object({
  teamId: z.string().uuid("Invalid team ID"),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = joinTeamSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { teamId } = parsed.data

    // Check if team exists
    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .select("id")
      .eq("id", teamId)
      .maybeSingle()

    if (teamError || !team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from("team_members")
      .select("id")
      .eq("team_id", teamId)
      .eq("user_id", session.user.id)
      .maybeSingle()

    if (existingMember) {
      return NextResponse.json({ error: "You are already a member of this team" }, { status: 400 })
    }

    // Add user as a member
    const { error: joinError } = await supabaseAdmin
      .from("team_members")
      .insert({
        team_id: teamId,
        user_id: session.user.id,
        role: "member",
      })

    if (joinError) {
      return NextResponse.json({ error: joinError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
