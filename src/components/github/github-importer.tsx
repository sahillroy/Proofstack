"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Loader2 } from "lucide-react"
import type { GitHubRepo } from "@/lib/github"

export function GitHubImporter() {
  const router = useRouter()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/github/repos")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setRepos(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load repos")
        setLoading(false)
      })
  }, [])

  async function importRepo(repo: GitHubRepo) {
    setImporting(repo.id)

    const res = await fetch("/api/github/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoName: repo.name,
        repoFullName: repo.full_name,
        repoUrl: repo.html_url,
        description: repo.description,
        language: repo.language,
        topics: repo.topics,
        homepage: repo.homepage,
      }),
    })

    const data = await res.json()

    if (res.ok && data.submissionId) {
      router.push(`/submit?imported=${data.submissionId}`)
    } else {
      setError(data.error ?? "Import failed")
      setImporting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm py-12 justify-center">
        <Loader2 size={16} className="animate-spin" />
        Loading your repos...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive text-sm py-8 text-center">{error}</div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className="border rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{repo.name}</span>
              {repo.language && (
                <Badge variant="outline" className="text-xs">
                  {repo.language}
                </Badge>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star size={11} /> {repo.stargazers_count}
              </span>
            </div>
            {repo.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
            {repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {repo.topics.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => importRepo(repo)}
            disabled={importing === repo.id}
            className="shrink-0"
          >
            {importing === repo.id ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              "Import"
            )}
          </Button>
        </div>
      ))}
    </div>
  )
}
