import type { Database, SupabaseClient } from "../../types";

type Department = Database["public"]["Tables"]["departments"]["Insert"];
type DepartmentUpdate = Database["public"]["Tables"]["departments"]["Update"];

export async function createDepartment(
  supabase: SupabaseClient,
  newDepartment: Department,
) {
  return await supabase.from("departments").insert(newDepartment)
    .select().single();
}

export async function updateDepartment(
  supabase: SupabaseClient,
  data: DepartmentUpdate,
) {
  if (!data.id) throw new Error("Department ID is required");
  return await supabase.from("departments").update(data)
    .eq("id", data.id).select().single();
}
