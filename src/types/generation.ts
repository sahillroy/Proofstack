export type BlogPost = {
  title: string
  intro: string
  body: string
  conclusion: string
  tags: string[]
}

export type LinkedInPost = {
  hook: string
  story: string
  bullets: string[]
  cta: string
  hashtags: string[]
}

export type GeneratedContent = {
  id: string
  submissionId: string
  userId: string
  blog: BlogPost
  linkedin: LinkedInPost
  createdAt: string
}
