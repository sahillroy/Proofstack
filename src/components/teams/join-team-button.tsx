"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function JoinTeamButton({ teamId }: { teamId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleJoin() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Failed to join team")
        setLoading(false)
      } else {
        window.location.reload()
      }
    } catch {
      setError("An unexpected error occurred.")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1.5 items-start">
      <Button onClick={handleJoin} disabled={loading} size="sm">
        {loading ? "Joining..." : "Join Team"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
