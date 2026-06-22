"use client"
import { useSession as useNextAuthSession } from "next-auth/react"

export function useSession() {
  const session = useNextAuthSession()
  return {
    session: session.data,
    status: session.status,
    isLoading: session.status === "loading",
    isAuthenticated: session.status === "authenticated",
    user: session.data?.user,
  }
}
