import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { generateContent } from "@/lib/gemini"
import { projectSubmissionSchema } from "@/lib/validations"
import { recalculateStreak } from "@/lib/streak"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { submissionId, ...formData } = body

  // Validate form data
  const parsed = projectSubmissionSchema.safeParse(formData)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  try {
    // Call Gemini
    const result = await generateContent(parsed.data)

    // Save to Supabase
    const { data: saved, error } = await supabaseAdmin
      .from("generated_posts")
      .insert({
        submission_id: submissionId,
        user_id: session.user.id,
        blog_post: result.blog,
        linkedin_post: result.linkedin,
      })
      .select("id")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Recalculate streak after every successful generation
    await recalculateStreak(session.user.id)

    return NextResponse.json({ id: saved.id, ...result })
  } catch (err) {
    console.error("Gemini generation error:", err)
    return NextResponse.json(
      { error: "AI generation failed. Please try again." },
      { status: 500 }
    )
  }
}
