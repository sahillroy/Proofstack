"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import type { GenerationResult } from "@/lib/gemini"

function LinkedinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

type Props = {
  data: GenerationResult["linkedin"]
  postId: string
  linkedinConnected: boolean
  alreadyPublished: boolean
}

export function LinkedInPreview({
  data,
  postId,
  linkedinConnected,
  alreadyPublished,
}: Props) {
  const [copied, setCopied] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(alreadyPublished)
  const [publishError, setPublishError] = useState<string | null>(null)

  const fullText = [
    data.hook,
    "",
    data.story,
    "",
    data.bullets.join("\n"),
    "",
    data.cta,
    "",
    data.hashtags.join(" "),
  ].join("\n")

  function copy() {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function publish() {
    setPublishing(true)
    setPublishError(null)

    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: fullText }),
      })

      if (res.ok) {
        setPublished(true)
      } else {
        const json = await res.json()
        setPublishError(json.error ?? "Publishing failed")
      }
    } catch {
      setPublishError("An unexpected error occurred while publishing.")
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="border rounded-xl p-6 flex flex-col gap-4 h-fit">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-medium">LinkedIn post</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copy} className="gap-1">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy"}
          </Button>

          {linkedinConnected ? (
            <Button
              size="sm"
              onClick={publish}
              disabled={publishing || published}
              className="gap-1"
            >
              <LinkedinIcon size={14} />
              {published ? "Published!" : publishing ? "Publishing..." : "Publish"}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.location.href = "/api/auth/signin/linkedin"}
              className="gap-1"
            >
              <LinkedinIcon size={14} />
              Connect LinkedIn
            </Button>
          )}
        </div>
      </div>

      {publishError && (
        <p className="text-xs text-destructive">{publishError}</p>
      )}

      <p className="text-sm font-semibold leading-snug">{data.hook}</p>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.story}</p>

      <ul className="space-y-1">
        {data.bullets.map((b, i) => (
          <li key={i} className="text-sm">
            {b}
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground">{data.cta}</p>

      <div className="flex flex-wrap gap-1 border-t pt-4">
        {data.hashtags.map((tag) => (
          <span key={tag} className="text-xs text-primary">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
