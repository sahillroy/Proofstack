import { GoogleGenerativeAI } from "@google/generative-ai"
import type { ProjectSubmissionInput } from "@/lib/validations"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.8,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
})

export function buildGenerationPrompt(data: ProjectSubmissionInput): string {
  const techList = data.techStack
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .join(", ")

  const skillsList = data.skillsGained
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ")

  return `
You are an expert tech content writer helping developers showcase their completed work to recruiters and the tech community.

Generate compelling content for this developer's completed ${data.type}.

PROJECT DETAILS:
- Title: ${data.title}
- Type: ${data.type === "project" ? "Personal/Side Project" : "Course Completion"}
- Description: ${data.description}
- Tech stack used: ${techList}
- What they achieved: ${data.outcome}
- Skills gained: ${skillsList}
- Tone requested: ${data.tone}
${data.githubUrl ? `- GitHub URL: ${data.githubUrl}` : ""}
${data.liveUrl ? `- Live URL: ${data.liveUrl}` : ""}

TONE GUIDE:
- professional: formal, achievement-focused, suitable for recruiters
- casual: conversational, friendly, relatable dev-to-dev voice
- storytelling: narrative arc, personal journey, challenges faced and overcome
- technical: deep-dive, implementation details, architecture decisions

Generate BOTH outputs. Return ONLY valid JSON — absolutely no markdown fences, no explanation text, nothing outside the JSON object:

{
  "blog": {
    "title": "compelling SEO-friendly title string",
    "intro": "2-3 sentence hook paragraph that draws the reader in",
    "body": "main content with ## subheadings separating 3-4 sections, written in markdown",
    "conclusion": "1-2 sentence wrap-up with a forward-looking statement",
    "tags": ["tag1", "tag2", "tag3", "tag4"]
  },
  "linkedin": {
    "hook": "single powerful opening line that stops the scroll — no more than 15 words",
    "story": "2-3 short punchy paragraphs separated by blank lines, personal and engaging",
    "bullets": [
      "✅ Key learning or achievement 1",
      "✅ Key learning or achievement 2",
      "✅ Key learning or achievement 3"
    ],
    "cta": "one closing call-to-action line — ask a question or invite connection",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
  }
}
`.trim()
}

export type GenerationResult = {
  blog: {
    title: string
    intro: string
    body: string
    conclusion: string
    tags: string[]
  }
  linkedin: {
    hook: string
    story: string
    bullets: string[]
    cta: string
    hashtags: string[]
  }
}

export async function generateContent(
  data: ProjectSubmissionInput
): Promise<GenerationResult> {
  const prompt = buildGenerationPrompt(data)
  const result = await geminiFlash.generateContent(prompt)
  const text = result.response.text()

  // Strip any accidental markdown fences Gemini may add
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim()

  return JSON.parse(cleaned) as GenerationResult
}
