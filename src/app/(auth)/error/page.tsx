export default function AuthErrorPage() {
  return (
    <div className="w-full max-w-sm p-8 border rounded-xl">
      <h1 className="text-xl font-semibold text-destructive">Auth Error</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Something went wrong during sign in. Please try again.
      </p>
    </div>
  )
}
