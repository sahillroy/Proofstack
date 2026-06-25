import { SidebarNav } from "./sidebar-nav"
import { Layers } from "lucide-react"
import Link from "next/link"

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-border/40 h-screen flex flex-col bg-card/50 backdrop-blur-md">
      <div className="h-14 border-b border-border/40 flex items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <Layers size={14} />
          </div>
          <span className="font-bold text-sm tracking-tight">ProofStack</span>
        </Link>
      </div>
      <SidebarNav />
    </aside>
  )
}
