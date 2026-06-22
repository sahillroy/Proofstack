import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Browser client — use in Client Components
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server/admin client — use in API routes only, never expose to browser
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
