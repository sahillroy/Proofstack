"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSubmissionSchema, type ProjectSubmissionInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "storytelling", label: "Storytelling" },
  { value: "technical", label: "Technical" },
] as const

export function SubmitForm({ userId, importedId }: { userId: string; importedId?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string>("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectSubmissionInput>({
    resolver: zodResolver(projectSubmissionSchema),
    defaultValues: { type: "project", tone: "professional" },
  })

  const selectedType = watch("type")
  const selectedTone = watch("tone")

  useEffect(() => {
    if (!importedId) return

    async function fetchImported() {
      setStatus("Loading imported project data...")
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("id", importedId)
        .single()

      if (error) {
        setStatus(`Error loading repo data: ${error.message}`)
        return
      }

      if (data) {
        setValue("title", data.title || "")
        setValue("type", (data.type as "project" | "course") || "project")
        setValue("description", data.description || "")
        setValue("techStack", data.tech_stack?.join(", ") || "")
        setValue("skillsGained", data.skills_gained?.join(", ") || "")
        setValue("githubUrl", data.github_url || "")
        setValue("liveUrl", data.live_url || "")
        setValue("tone", (data.tone as "professional" | "casual" | "storytelling" | "technical") || "professional")
        setStatus("")
      }
    }

    fetchImported()
  }, [importedId, setValue])

  async function onSubmit(data: ProjectSubmissionInput) {
    setIsLoading(true)

    try {
      let submissionId = importedId

      // 1. Save or update submission in Supabase
      if (importedId) {
        setStatus("Updating your project...")
        const { error: subError } = await supabase
          .from("submissions")
          .update({
            title: data.title,
            type: data.type,
            description: data.description,
            tech_stack: data.techStack.split(",").map((t) => t.trim()).filter(Boolean),
            outcome: data.outcome,
            skills_gained: data.skillsGained.split(",").map((s) => s.trim()).filter(Boolean),
            github_url: data.githubUrl || null,
            live_url: data.liveUrl || null,
            tone: data.tone,
          })
          .eq("id", importedId)

        if (subError) throw new Error(subError.message)
      } else {
        setStatus("Saving your project...")
        const { data: submission, error: subError } = await supabase
          .from("submissions")
          .insert({
            user_id: userId,
            title: data.title,
            type: data.type,
            description: data.description,
            tech_stack: data.techStack.split(",").map((t) => t.trim()).filter(Boolean),
            outcome: data.outcome,
            skills_gained: data.skillsGained.split(",").map((s) => s.trim()).filter(Boolean),
            github_url: data.githubUrl || null,
            live_url: data.liveUrl || null,
            tone: data.tone,
          })
          .select("id")
          .single()

        if (subError) throw new Error(subError.message)
        submissionId = submission.id
      }

      // 2. Call generate API
      setStatus("Generating your content with AI...")
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, ...data }),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? "Generation failed")
      }

      const generated = await res.json()

      // 3. Redirect to result page
      router.push(`/generate/${generated.id}`)
    } catch (err: any) {
      setStatus(`Error: ${err.message}`)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Type selector */}
      <div>
        <Label>What are you sharing?</Label>
        <div className="flex gap-3 mt-2">
          {(["project", "course"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setValue("type", t)}
              className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                selectedType === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "project" ? "🛠 Project" : "🎓 Course"}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder={selectedType === "project" ? "e.g. AI Resume Screener" : "e.g. Full Stack Web Dev — The Odin Project"}
          className="mt-1"
          {...register("title")}
        />
        {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="What did you build or learn? What problem does it solve?"
          className="mt-1"
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
      </div>

      {/* Tech stack */}
      <div>
        <Label htmlFor="techStack">Tech stack</Label>
        <Input
          id="techStack"
          placeholder="React, Next.js, Supabase, TypeScript (comma separated)"
          className="mt-1"
          {...register("techStack")}
        />
        {errors.techStack && <p className="text-xs text-destructive mt-1">{errors.techStack.message}</p>}
      </div>

      {/* Outcome */}
      <div>
        <Label htmlFor="outcome">What did you achieve?</Label>
        <Textarea
          id="outcome"
          rows={2}
          placeholder="e.g. Built a full-stack app deployed on Vercel with 50+ users, or Completed 120 hours of curriculum and can now build REST APIs"
          className="mt-1"
          {...register("outcome")}
        />
        {errors.outcome && <p className="text-xs text-destructive mt-1">{errors.outcome.message}</p>}
      </div>

      {/* Skills gained */}
      <div>
        <Label htmlFor="skillsGained">Skills gained</Label>
        <Input
          id="skillsGained"
          placeholder="API design, authentication, database schema, deployment (comma separated)"
          className="mt-1"
          {...register("skillsGained")}
        />
        {errors.skillsGained && <p className="text-xs text-destructive mt-1">{errors.skillsGained.message}</p>}
      </div>

      {/* Optional links */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="githubUrl">GitHub URL (optional)</Label>
          <Input id="githubUrl" placeholder="https://github.com/..." className="mt-1" {...register("githubUrl")} />
          {errors.githubUrl && <p className="text-xs text-destructive mt-1">{errors.githubUrl.message}</p>}
        </div>
        <div>
          <Label htmlFor="liveUrl">Live URL (optional)</Label>
          <Input id="liveUrl" placeholder="https://yourapp.vercel.app" className="mt-1" {...register("liveUrl")} />
          {errors.liveUrl && <p className="text-xs text-destructive mt-1">{errors.liveUrl.message}</p>}
        </div>
      </div>

      {/* Tone selector */}
      <div>
        <Label>Content tone</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {TONES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("tone", value)}
              className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                selectedTone === value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? status || "Working..." : "Generate blog + LinkedIn post"}
      </Button>
    </form>
  )
}
