import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Safe initialization to prevent runtime crash on evaluation if env vars are missing
let client: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
  client = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing in .env.local");
}

export const supabaseAdmin = client as SupabaseClient;