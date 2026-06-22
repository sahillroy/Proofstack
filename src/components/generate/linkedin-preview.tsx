"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import type { GenerationResult } from "@/lib/gemini"

export function LinkedInPreview({ data }: { data: GenerationResult["linkedin"] }) {
  const [copied, setCopied] = useState(false)

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

  return (
    <div className="border rounded-xl p-6 flex flex-col gap-4 h-fit">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">LinkedIn post</span>
        <Button variant="outline" size="sm" onClick={copy} className="gap-1">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

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
