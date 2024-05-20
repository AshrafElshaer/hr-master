import type { Database, SupabaseClient } from "../../types";

type Department = Database["public"]["Tables"]["departments"]["Insert"];

export async function createDepartment(
  supabase: SupabaseClient,
  newDepartment: Department,
) {
  return await supabase.from("departments").insert(newDepartment)
    .select().single();
}


