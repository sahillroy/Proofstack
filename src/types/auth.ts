export type AppUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  githubUsername?: string
}

export type AppSession = {
  user: AppUser
  expires: string
}
