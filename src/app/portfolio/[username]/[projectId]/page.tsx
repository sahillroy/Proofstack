export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ username: string; projectId: string }>
}) {
  const { username, projectId } = await params
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold">Project Detail</h1>
      <p className="text-muted-foreground text-sm mt-1">
        {username} / {projectId}
      </p>
    </div>
  )
}
