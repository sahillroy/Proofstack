import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Submission } from "@/types"

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const { data: submissions } = await supabaseAdmin
    .from("submissions")
    .select("*, generated_posts(id)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Submission history</h1>

      {submissions && submissions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {submissions.map((s: any) => (
            <div
              key={s.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Badge variant={s.type === "project" ? "default" : "secondary"}>
                  {s.type}
                </Badge>
                <span className="font-medium text-sm">{s.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  {formatDate(s.created_at)}
                </span>
                {s.generated_posts?.length > 0 && (
                  <Link
                    href={`/generate/${s.generated_posts[0].id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    View content →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No submissions yet.</p>
      )}
    </div>
  )
}
