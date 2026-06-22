export type SubmissionType = "project" | "course"
export type Tone = "professional" | "casual" | "storytelling" | "technical"

export type Submission = {
  id: string
  user_id: string
  title: string
  type: SubmissionType
  description: string | null
  tech_stack: string[] | null
  outcome: string | null
  skills_gained: string[] | null
  github_url: string | null
  live_url: string | null
  certificate_url: string | null
  tone: Tone | null
  created_at: string
}
