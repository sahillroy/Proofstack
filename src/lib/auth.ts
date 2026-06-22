import type { NextAuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
import { supabaseAdmin } from "@/lib/supabase"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: { scope: "read:user user:email repo" },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      const githubProfile = profile as any

      // Upsert profile — creates on first login, updates avatar on subsequent logins
      const { error } = await supabaseAdmin.from("profiles").upsert(
        {
          id: user.id,
          full_name: user.name ?? githubProfile?.name ?? null,
          avatar_url: user.image ?? null,
          github_username: githubProfile?.login ?? null,
        },
        { onConflict: "id", ignoreDuplicates: false }
      )

      if (error) {
        console.error("Supabase upsert error:", error)
        return false
      }

      return true
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub

        // Fetch username and username_set from Supabase to include in session
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("username, username_set, streak_count")
          .eq("id", token.sub)
          .single()

        session.user.username = profile?.username ?? null
        session.user.usernameSet = profile?.username_set ?? false
        session.user.streakCount = profile?.streak_count ?? 0
      }
      return session
    },

    async jwt({ token, account, profile }) {
      if (account) {
        token.githubUsername = (profile as any)?.login
      }
      return token
    },
  },
}
