import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: Request) {
  // Verify this is called by Vercel cron, not a random visitor
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Find users who:
  // 1. Have a streak > 0
  // 2. Last posted between 6 and 7 days ago (streak about to break)
  const sixDaysAgo = new Date()
  sixDaysAgo.setDate(sixDaysAgo.getDate() - 6)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: atRiskUsers } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, username, streak_count, email")
    .gt("streak_count", 0)
    .lte("last_posted_at", sixDaysAgo.toISOString())
    .gte("last_posted_at", sevenDaysAgo.toISOString())

  if (!atRiskUsers || atRiskUsers.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0

  for (const user of atRiskUsers) {
    const email = user.email
    if (!email) continue

    const firstName = user.full_name?.split(" ")[0] ?? "there"
    const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${user.username}`

    const { error } = await resend.emails.send({
      from: "ProofStack <onboarding@resend.dev>",
      to: email,
      subject: `🔥 Your ${user.streak_count}-week streak is about to break`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">
            Hey ${firstName} — your streak is at risk 🔥
          </h2>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6;">
            You've built an impressive <strong>${user.streak_count}-week posting streak</strong> on ProofStack. 
            But you haven't posted this week yet — and your streak will reset tomorrow.
          </p>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-top: 12px;">
            Take 5 minutes to log a project or course — even a small one counts. 
            Keep the momentum going.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/submit" 
             style="display: inline-block; margin-top: 20px; padding: 12px 24px; 
                    background: #000; color: #fff; border-radius: 8px; 
                    text-decoration: none; font-size: 14px; font-weight: 500;">
            Submit a project →
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
            Your portfolio: <a href="${portfolioUrl}" style="color: #6b7280;">${portfolioUrl}</a>
          </p>
        </div>
      `,
    })

    if (!error) sent++
  }

  return NextResponse.json({ sent, total: atRiskUsers.length })
}
