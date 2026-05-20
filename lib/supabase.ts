import { createClient } from "@supabase/supabase-js";
import type { SupabaseUser } from "./types";

// Types are cast manually since we don't use Supabase CLI type generation here
export type { SupabaseUser };

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
