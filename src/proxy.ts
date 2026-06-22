import withAuth from "next-auth/middleware"

export const proxy = withAuth

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/submit/:path*",
    "/generate/:path*",
    "/history/:path*",
    "/streaks/:path*",
    "/onboarding",
  ],
}
