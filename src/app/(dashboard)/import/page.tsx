import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { GitHubImporter } from "@/components/github/github-importer"

export default async function ImportPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Import from GitHub</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pick a repo and we&apos;ll pre-fill your submission from the README and metadata.
        </p>
      </div>
      <GitHubImporter />
    </div>
  )
}
