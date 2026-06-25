"use client"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import Image from "next/image"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="h-14 border-b border-border/40 flex items-center justify-between px-6 bg-background/60 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2">
        {session?.user?.username && (
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/50">
            portfolio: {session.user.username}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {session?.user && (
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? "Profile"}
                width={32}
                height={32}
                className="rounded-full border border-border"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
                <User size={16} className="text-muted-foreground" />
              </div>
            )}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium leading-none">{session.user.name}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{session.user.email}</span>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign Out"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </header>
  )
}
