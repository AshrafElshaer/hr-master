import type { SupabaseClient } from "../../types";


export function getUser(supabase: SupabaseClient) {
  return supabase.auth.getUser();
}
