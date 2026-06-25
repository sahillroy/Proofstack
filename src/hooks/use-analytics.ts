"use client"
import { usePostHog } from "posthog-js/react"

export function useAnalytics() {
  const posthog = usePostHog()

  return {
    trackPortfolioView: (username: string, projectId?: string) => {
      posthog?.capture("portfolio_viewed", {
        username,
        project_id: projectId ?? null,
        has_project: !!projectId,
      })
    },
    trackGeneration: (type: "blog" | "linkedin" | "both", tone: string) => {
      posthog?.capture("content_generated", { type, tone })
    },
    trackCopy: (platform: "blog" | "linkedin") => {
      posthog?.capture("content_copied", { platform })
    },
    trackLinkedInPublish: () => {
      posthog?.capture("linkedin_published")
    },
    trackGitHubImport: (repoName: string) => {
      posthog?.capture("github_repo_imported", { repo_name: repoName })
    },
  }
}
