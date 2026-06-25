import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SubmitForm } from "@/components/forms/submit-form"

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ imported?: string }>
}) {
  const { imported } = await searchParams
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Submit a project or course</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Fill in the details and we&apos;ll generate your blog post and LinkedIn content.
        </p>
      </div>
      <SubmitForm userId={session.user.id} importedId={imported} />
    </div>
  )
}
