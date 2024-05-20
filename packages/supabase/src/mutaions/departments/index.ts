import type { Database, SupabaseClient } from "../../types";

// type Department = Database["public"]["Tables"]["departments"]["Insert"];

export async function createDepartment(
  supabase: SupabaseClient,
  // department: Department,
) {
  // return await supabase.from("departments").insert(department)
  //   .select().single();
}
