import type { NextAuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
import LinkedIn from "next-auth/providers/linkedin"
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
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: { scope: "r_liteprofile r_emailaddress w_member_social" },
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

      if (account?.provider === "github") {
        // First login — upsert base profile
        const { error } = await supabaseAdmin.from("profiles").upsert(
          {
            id: user.id,
            full_name: user.name ?? githubProfile?.name ?? null,
            avatar_url: user.image ?? null,
            github_username: githubProfile?.login ?? null,
            github_access_token: account.access_token ?? null,
          },
          { onConflict: "id", ignoreDuplicates: false }
        )
        if (error) {
          console.error("Supabase upsert error:", error)
          return false
        }
      }

      if (account?.provider === "linkedin") {
        // LinkedIn connect — find existing profile by email and update tokens
        const { data: existing } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single()

        if (existing) {
          await supabaseAdmin
            .from("profiles")
            .update({
              linkedin_access_token: account.access_token ?? null,
              linkedin_connected: true,
              linkedin_urn: `urn:li:person:${(profile as any)?.id}`,
            })
            .eq("id", user.id)
        }
      }

      return true
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub

        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("username, username_set, streak_count, linkedin_connected, github_access_token")
          .eq("id", token.sub)
          .single()

        session.user.username = profile?.username ?? null
        session.user.usernameSet = profile?.username_set ?? false
        session.user.streakCount = profile?.streak_count ?? 0
        session.user.linkedinConnected = profile?.linkedin_connected ?? false
        session.user.githubAccessToken = profile?.github_access_token ?? null
      }
      return session
    },

    async jwt({ token, account, profile }) {
      if (account?.provider === "github") {
        token.githubUsername = (profile as any)?.login
        token.githubAccessToken = account.access_token
      }
      return token
    },
  },
}