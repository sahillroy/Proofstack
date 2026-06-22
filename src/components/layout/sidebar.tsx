import { SidebarNav } from "./sidebar-nav"

export function Sidebar() {
  return (
    <aside className="w-56 border-r h-screen flex flex-col bg-background">
      <div className="h-14 border-b flex items-center px-6">
        <span className="font-bold text-sm">ProofStack</span>
      </div>
      <SidebarNav />
    </aside>
  )
}
