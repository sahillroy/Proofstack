import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { redirect, notFound } from "next/navigation"
import { BlogPreview } from "@/components/generate/blog-preview"
import { LinkedInPreview } from "@/components/generate/linkedin-preview"
import type { GenerationResult } from "@/lib/gemini"

export default async function GenerateResultPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const { data: post } = await supabaseAdmin
    .from("generated_posts")
    .select("*, submissions(*)")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single()

  if (!post) notFound()

  const blog = post.blog_post as GenerationResult["blog"]
  const linkedin = post.linkedin_post as GenerationResult["linkedin"]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Your generated content</h1>
        <p className="text-muted-foreground text-sm mt-1">
          For: {(post.submissions as any)?.title}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <BlogPreview data={blog} />
        <LinkedInPreview data={linkedin} />
      </div>
    </div>
  )
}
