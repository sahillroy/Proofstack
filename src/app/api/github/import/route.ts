import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { getRepoReadme } from "@/lib/github"
import { z } from "zod"

const importSchema = z.object({
  repoName: z.string(),
  repoFullName: z.string(),
  repoUrl: z.string().url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  topics: z.array(z.string()),
  homepage: z.string().nullable(),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = importSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { repoName, repoFullName, repoUrl, description, language, topics, homepage } =
    parsed.data

  // Fetch GitHub access token
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("github_access_token, github_username")
    .eq("id", session.user.id)
    .single()

  if (!profile?.github_access_token) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 400 })
  }

  // Fetch README to use as description
  const [owner] = repoFullName.split("/")
  const readme = await getRepoReadme(
    profile.github_access_token,
    owner,
    repoName
  )

  // Build tech stack from language + topics
  const techStack = [
    ...(language ? [language] : []),
    ...topics.filter((t) => t.length < 30),
  ].slice(0, 8)

  // Create a pre-filled submission
  const { data: submission, error } = await supabaseAdmin
    .from("submissions")
    .insert({
      user_id: session.user.id,
      title: repoName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      type: "project",
      description: description ?? readme?.slice(0, 500) ?? "",
      tech_stack: techStack,
      outcome: "",
      skills_gained: topics.slice(0, 5),
      github_url: repoUrl,
      live_url: homepage ?? null,
      github_repo_url: repoUrl,
      github_repo_name: repoFullName,
      tone: "professional",
    })
    .select("id")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ submissionId: submission.id })
}
