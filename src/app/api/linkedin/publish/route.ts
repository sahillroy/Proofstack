import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { z } from "zod"

const publishSchema = z.object({
  postId: z.string(),
  content: z.string().min(1).max(3000),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const parsed = publishSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { postId, content } = parsed.data

  // Fetch LinkedIn token and URN from Supabase
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("linkedin_access_token, linkedin_urn, linkedin_connected")
    .eq("id", session.user.id)
    .single()

  if (!profile?.linkedin_connected || !profile.linkedin_access_token) {
    return NextResponse.json(
      { error: "LinkedIn not connected. Please connect your LinkedIn account first." },
      { status: 400 }
    )
  }

  if (!profile.linkedin_urn) {
    return NextResponse.json(
      { error: "LinkedIn profile URN not found. Please reconnect LinkedIn." },
      { status: 400 }
    )
  }

  try {
    // LinkedIn UGC Posts API
    const linkedInRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${profile.linkedin_access_token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: profile.linkedin_urn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    })

    if (!linkedInRes.ok) {
      const errText = await linkedInRes.text()
      console.error("LinkedIn API error:", errText)
      return NextResponse.json(
        { error: "LinkedIn rejected the post. Check your permissions." },
        { status: 500 }
      )
    }

    // Mark as published in Supabase
    await supabaseAdmin
      .from("generated_posts")
      .update({
        linkedin_published: true,
        linkedin_published_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .eq("user_id", session.user.id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("LinkedIn publish error:", err)
    return NextResponse.json(
      { error: "Failed to publish to LinkedIn" },
      { status: 500 }
    )
  }
}
