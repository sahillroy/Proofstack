"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import type { GenerationResult } from "@/lib/gemini"

export function BlogPreview({ data }: { data: GenerationResult["blog"] }) {
  const [copied, setCopied] = useState(false)
  const { trackCopy } = useAnalytics()

  const fullText = `# ${data.title}\n\n${data.intro}\n\n${data.body}\n\n${data.conclusion}`

  function copy() {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    trackCopy("blog")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border rounded-xl p-6 flex flex-col gap-4 h-fit">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Blog post</span>
        <Button variant="outline" size="sm" onClick={copy} className="gap-1">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      <h2 className="text-lg font-semibold leading-snug">{data.title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{data.intro}</p>

      <div className="text-sm leading-relaxed whitespace-pre-wrap border-t pt-4">
        {data.body}
      </div>

      <p className="text-sm text-muted-foreground italic border-t pt-4">
        {data.conclusion}
      </p>

      <div className="flex flex-wrap gap-2 border-t pt-4">
        {data.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            #{tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
