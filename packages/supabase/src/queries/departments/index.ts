import type { SupabaseClient } from "../../types";
export async function getDepartments(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("departments").select("*");
  if (error) {
    throw error;
  }

  return data;
}
