import { supabaseAdmin } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import type { GenerationResult } from "@/lib/gemini"

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ username: string; projectId: string }>
}) {
  const { username, projectId } = await params

  // Fetch the profile
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, username, full_name")
    .eq("username", username)
    .single()

  if (!profile) notFound()

  // Fetch the submission
  const { data: submission } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", profile.id)
    .single()

  if (!submission) notFound()

  // Fetch latest generated post for this submission
  const { data: post } = await supabaseAdmin
    .from("generated_posts")
    .select("*")
    .eq("submission_id", submission.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  const blog = post?.blog_post as GenerationResult["blog"] | null

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">

      {/* Back link */}
      <Link
        href={`/portfolio/${username}`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft size={14} /> Back to {profile.full_name ?? profile.username}&apos;s portfolio
      </Link>

      {/* Project header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={submission.type === "project" ? "default" : "secondary"}>
            {submission.type}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(submission.created_at)}
          </span>
        </div>

        <h1 className="text-3xl font-bold">{submission.title}</h1>

        {submission.outcome && (
          <p className="text-muted-foreground mt-3 text-base leading-relaxed">
            {submission.outcome}
          </p>
        )}

        {/* Tech stack */}
        {submission.tech_stack && submission.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {submission.tech_stack.map((t: string) => (
              <span
                key={t}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-4 mt-4">
          {submission.github_url && (
            <a
              href={submission.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <GithubIcon size={14} /> GitHub
            </a>
          )}
          {submission.live_url && (
            <a
              href={submission.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink size={14} /> Live demo
            </a>
          )}
        </div>
      </div>

      {/* Blog content */}
      {blog && (
        <article className="prose prose-sm max-w-none border-t pt-8">
          <h2 className="text-2xl font-semibold mb-4">{blog.title}</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{blog.intro}</p>
          <div className="leading-relaxed whitespace-pre-wrap">{blog.body}</div>
          <p className="text-muted-foreground italic mt-6">{blog.conclusion}</p>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 not-prose">
              {blog.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">#{tag}</Badge>
              ))}
            </div>
          )}
        </article>
      )}

      {/* Skills gained */}
      {submission.skills_gained && submission.skills_gained.length > 0 && (
        <div className="border-t mt-10 pt-8">
          <h3 className="font-semibold mb-3">Skills gained</h3>
          <div className="flex flex-wrap gap-2">
            {submission.skills_gained.map((skill: string) => (
              <span
                key={skill}
                className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
