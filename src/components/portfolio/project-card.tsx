import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ArrowRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Submission } from "@/types"

function GithubIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}


type Props = {
  project: Submission
  showActions?: boolean
  portfolioUsername?: string
}

export function ProjectCard({ project, showActions, portfolioUsername }: Props) {
  return (
    <div className="border rounded-xl p-5 hover:shadow-sm transition-shadow bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={project.type === "project" ? "default" : "secondary"}>
              {project.type}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(project.created_at)}
            </span>
          </div>
          <h3 className="font-semibold mt-2 truncate">{project.title}</h3>
          {project.outcome && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.outcome}
            </p>
          )}
        </div>
      </div>

      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tech_stack.map((t) => (
            <span
              key={t}
              className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <GithubIcon size={13} /> GitHub
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink size={13} /> Live
          </a>
        )}
        {portfolioUsername && (
          <Link
            href={`/portfolio/${portfolioUsername}/${project.id}`}
            className="flex items-center gap-1 text-xs text-primary hover:underline ml-auto"
          >
            View details <ArrowRight size={12} />
          </Link>
        )}
        {showActions && (
          <Link
            href={`/history`}
            className="flex items-center gap-1 text-xs text-primary hover:underline ml-auto"
          >
            See generated content <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  )
}
