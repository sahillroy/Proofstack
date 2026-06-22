import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { usernameSchema } from "@/lib/validations"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = usernameSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { username } = parsed.data

  // Check username is not taken
  const { data: existing } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single()

  if (existing) {
    return NextResponse.json(
      { error: "Username is already taken" },
      { status: 409 }
    )
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ username, username_set: true })
    .eq("id", session.user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
