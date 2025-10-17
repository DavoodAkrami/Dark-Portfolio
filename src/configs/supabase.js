import { createClient } from "@supabase/supabase-js" 

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABSASE_PUBLIC_API
)