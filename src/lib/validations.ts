import { z } from "zod"

export const projectSubmissionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["project", "course"]),
  description: z.string().min(20, "Please describe your work in more detail"),
  techStack: z.string().min(1, "Add at least one technology"),
  outcome: z.string().min(10, "Describe what you achieved"),
  skillsGained: z.string().min(1, "Add at least one skill"),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tone: z.enum(["professional", "casual", "storytelling", "technical"]),
})

export type ProjectSubmissionInput = z.infer<typeof projectSubmissionSchema>

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be under 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, hyphens and underscores allowed"
    ),
})

export type UsernameInput = z.infer<typeof usernameSchema>
