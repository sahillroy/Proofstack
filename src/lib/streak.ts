import { supabaseAdmin } from "@/lib/supabase"

/**
 * Recalculates a user's streak after a new submission.
 *
 * Rules:
 * - A "week" is a Monday–Sunday calendar week.
 * - The streak increments by 1 for each consecutive week that has at least one submission.
 * - If the user missed last week entirely, the streak resets to 1.
 * - If the user already submitted this week, the streak count stays the same (no double-count).
 */
export async function recalculateStreak(userId: string): Promise<void> {
  // Fetch all submission dates for this user, newest first
  const { data: submissions } = await supabaseAdmin
    .from("submissions")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!submissions || submissions.length === 0) return

  // Get the ISO week number and year for a given date
  function getWeekKey(date: Date): string {
    const d = new Date(date)
    d.setUTCHours(0, 0, 0, 0)
    // ISO week: Thursday is the representative day
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    )
    return `${d.getUTCFullYear()}-W${weekNo}`
  }

  // Collect unique weeks that had at least one submission
  const weeks = new Set(
    submissions.map((s: { created_at: string }) => getWeekKey(new Date(s.created_at)))
  )

  const sortedWeeks = Array.from(weeks).sort().reverse() // newest first

  const currentWeekKey = getWeekKey(new Date())

  let streak = 0
  let expectedWeek = currentWeekKey

  for (const week of sortedWeeks) {
    if (week === expectedWeek) {
      streak++
      // Move expected week back by 7 days
      const prevDate = new Date()
      prevDate.setUTCDate(
        prevDate.getUTCDate() - streak * 7
      )
      expectedWeek = getWeekKey(prevDate)
    } else {
      break
    }
  }

  // Update the profile
  await supabaseAdmin
    .from("profiles")
    .update({
      streak_count: streak,
      last_posted_at: submissions[0].created_at,
    })
    .eq("id", userId)
}
