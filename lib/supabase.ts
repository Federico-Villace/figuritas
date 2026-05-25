import { createClient } from "@supabase/supabase-js";
import type { SupabaseUser } from "./types";

export type { SupabaseUser };

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cliente con privilegios para operaciones server-side (storage uploads)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
