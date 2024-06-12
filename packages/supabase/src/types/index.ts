import type { SupabaseClient as ClientType } from "@supabase/supabase-js";

import type { Database } from "./db";

export type SupabaseClient = ClientType<Database>;

export * from "./db";

export type User = Database["public"]["Tables"]["users"]["Row"];
export type Department = Database["public"]["Tables"]["departments"]["Row"];
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export interface UserWithDepartment extends User {
  department: Department & { person_in_charge: User };
}
export interface UserWithOrdanization extends User {
  organization: Organization;
}
export interface UserWithDepartmentAndOrganization extends User {
  department: Department;
  organization: Organization;
}



export type StorageFile = Database["storage"]["Tables"]["objects"]["Row"];
