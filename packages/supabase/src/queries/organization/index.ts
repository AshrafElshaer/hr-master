import type { Database, SupabaseClient } from "../../types";
import { getUser } from "../../queries/user";

export async function getAllManagers(supabase: SupabaseClient) {
  const { user } = await getUser(supabase);
  if (!user || !user.organization_id) {
    throw new Error("User not found");
  }
  const { data, error } = await supabase.from("users")
    .select("*")
    .eq("organization_id", user.organization_id)
    .in("role", [
      "manager",
      "owner",
    ]);

  if (error) {
    throw error;
  }

  return data;
}
