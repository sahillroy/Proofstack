import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

export function StreakBadge({
  count,
  className,
}: {
  count: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium",
        count > 0
          ? "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
          : "border-border bg-muted text-muted-foreground",
        className
      )}
    >
      <Flame size={14} />
      {count} week streak
    </div>
  )
}
