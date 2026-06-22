import Image from "next/image"
import type { PublicProfile } from "@/types"

function GithubIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  const avatarUrl = profile.avatar_url ?? profile.avatarUrl
  const fullName = profile.full_name ?? profile.fullName
  const githubUsername = profile.github_username ?? profile.githubUsername

  return (
    <div className="flex items-center gap-4">
      {avatarUrl && (
        <Image
          src={avatarUrl}
          alt={fullName ?? profile.username}
          width={64}
          height={64}
          className="rounded-full"
        />
      )}
      <div>
        <h1 className="text-xl font-semibold">{fullName ?? profile.username}</h1>
        <p className="text-sm text-muted-foreground">@{profile.username}</p>
        {profile.bio && (
          <p className="text-sm mt-1">{profile.bio}</p>
        )}
        {githubUsername && (
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1"
          >
            <GithubIcon size={13} /> {githubUsername}
          </a>
        )}
      </div>
    </div>
  )
}
