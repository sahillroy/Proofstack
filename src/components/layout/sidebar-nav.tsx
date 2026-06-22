"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, History, Flame, Upload, Sparkles } from "lucide-react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/submit",    label: "Submit",    icon: Upload },
  { href: "/generate",  label: "Generate",  icon: Sparkles },
  { href: "/history",   label: "History",   icon: History },
  { href: "/streaks",   label: "Streaks",   icon: Flame },
]

export function SidebarNav() {
  const pathname = usePathname()
  return (
    <nav className="flex-1 py-4 px-3 space-y-1">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
            pathname === href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon size={16} />
          {label}
        </Link>
      ))}
    </nav>
  )
}
