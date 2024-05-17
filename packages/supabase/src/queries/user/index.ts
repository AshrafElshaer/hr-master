import type { SupabaseClient } from "../../types";

export async function getUser(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
