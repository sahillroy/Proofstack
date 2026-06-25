"use client"
import { useEffect } from "react"
import { useAnalytics } from "@/hooks/use-analytics"
import { supabase } from "@/lib/supabase"

export function PortfolioViewTracker({
  username,
  projectId,
}: {
  username: string
  projectId?: string
}) {
  const { trackPortfolioView } = useAnalytics()

  useEffect(() => {
    // 1. Track in PostHog client
    trackPortfolioView(username, projectId)

    // 2. Track in Supabase portfolio_views table
    async function recordView() {
      try {
        const { error } = await supabase.from("portfolio_views").insert({
          username,
          submission_id: projectId || null,
        })
        if (error) {
          console.error("Supabase portfolio_views insert error:", error.message)
        }
      } catch (err) {
        console.error("Failed to record portfolio view in Supabase:", err)
      }
    }

    recordView()
  }, [username, projectId, trackPortfolioView])

  return null
}
