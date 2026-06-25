"use client"
import { SessionProvider } from "next-auth/react"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { useEffect } from "react"

function PostHogInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: "/ingest",
        capture_pageview: true,
        capture_pageleave: true,
        persistence: "localStorage",
      })
    }
  }, [])

  return (
    <PostHogProvider client={posthog}>
      {children}
    </PostHogProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PostHogInit>
        {children}
      </PostHogInit>
    </SessionProvider>
  )
}
