import type { User } from "@hr-toolkit/supabase/types";
import type { Database, SupabaseClient } from "../../types";
type Department = Database["public"]["Tables"]["departments"]["Row"];

export interface DepartmentWithUser extends Department {
  person_in_charge: User[];
}
export async function getDepartments(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("departments")
    .select("*, person_in_charge:person_in_charge_id(*)");

  if (error) {
    throw error;
  }

  return data as DepartmentWithUser[];
}
