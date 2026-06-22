"use client"
import { useState, useEffect } from "react"

export function useStreak(userId?: string) {
  const [streakCount, setStreakCount] = useState(0)

  // Full implementation in Phase 2
  return { streakCount }
}
