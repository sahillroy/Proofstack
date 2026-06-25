import { Octokit } from "@octokit/rest"

export function getOctokit(accessToken: string) {
  return new Octokit({ auth: accessToken })
}

export type GitHubRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  topics: string[]
  updated_at: string | null
  private: boolean
}

/**
 * Fetches the user's public GitHub repos, sorted by most recently updated.
 * Only returns non-forked, non-archived public repos.
 */
export async function getUserRepos(accessToken: string): Promise<GitHubRepo[]> {
  const octokit = getOctokit(accessToken)

  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    per_page: 30,
    type: "owner",
  })

  return data
    .filter((r) => !r.fork && !r.archived && !r.private)
    .map((r) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage ?? null,
      language: r.language ?? null,
      stargazers_count: r.stargazers_count,
      topics: r.topics ?? [],
      updated_at: r.updated_at ?? null,
      private: r.private,
    }))
}

/**
 * Fetches the README content for a given repo and decodes it from base64.
 */
export async function getRepoReadme(
  accessToken: string,
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const octokit = getOctokit(accessToken)
    const { data } = await octokit.repos.getReadme({ owner, repo })
    return Buffer.from(data.content, "base64").toString("utf-8")
  } catch {
    return null
  }
}
