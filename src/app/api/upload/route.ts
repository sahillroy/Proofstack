import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // Supabase Storage upload — implemented in Phase 2
  return NextResponse.json({ message: "upload endpoint ready" }, { status: 200 })
}
