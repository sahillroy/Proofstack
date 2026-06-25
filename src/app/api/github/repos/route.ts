import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserRepos } from "@/lib/github"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch access token from Supabase (more reliable than session token)
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("github_access_token")
    .eq("id", session.user.id)
    .single()

  if (!profile?.github_access_token) {
    return NextResponse.json(
      { error: "GitHub not connected" },
      { status: 400 }
    )
  }

  try {
    const repos = await getUserRepos(profile.github_access_token)
    return NextResponse.json(repos)
  } catch (err) {
    console.error("GitHub API error:", err)
    return NextResponse.json(
      { error: "Failed to fetch repos from GitHub" },
      { status: 500 }
    )
  }
}
