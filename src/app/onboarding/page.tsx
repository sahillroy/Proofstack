"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { usernameSchema, type UsernameInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function OnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameInput>({
    resolver: zodResolver(usernameSchema),
  })

  async function onSubmit(data: UsernameInput) {
    setIsLoading(true)
    setServerError(null)

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: data.username }),
    })

    const json = await res.json()

    if (!res.ok) {
      setServerError(json.error ?? "Something went wrong")
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm border rounded-xl p-8 shadow-sm bg-card">
        <h1 className="text-xl font-semibold">Choose your username</h1>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          This becomes your public portfolio URL:{" "}
          <span className="text-foreground font-mono">
            proofstack.dev/portfolio/
            <span className="text-primary">yourname</span>
          </span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="sahill"
              className="mt-1"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-xs text-destructive mt-1">
                {errors.username.message}
              </p>
            )}
            {serverError && (
              <p className="text-xs text-destructive mt-1">{serverError}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  )
}
