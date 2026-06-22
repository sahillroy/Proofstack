"use client"
import { useState } from "react"

export function useUpload() {
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Full implementation in Phase 2
  return { progress, isUploading, error }
}
