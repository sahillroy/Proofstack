import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string | null
      usernameSet: boolean
      streakCount: number
      linkedinConnected: boolean
      githubAccessToken: string | null
      githubUsername?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubUsername?: string
    githubAccessToken?: string
  }
}
