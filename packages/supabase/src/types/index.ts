import type { SupabaseClient as ClientType } from "@supabase/supabase-js";
import { createServerClient } from "../client/server";
import type { Database } from "./db";
export * from "./db";

export type SupabaseClient = ClientType<Database>;

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

type StorageListFunction = SupabaseClient["storage"]["from"];
type ListFunctionReturn = ReturnType<StorageListFunction>;
type StorageFilePromise = Awaited<
  ReturnType<ListFunctionReturn["list"]>
>;
type StorageFileType = Pick<StorageFilePromise, "data">["data"];
export type StorageFile = NonNullable<StorageFileType>[number];

export type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
export interface AttendanceWithUser extends Attendance {
  user: User;
}
export interface AttendanceWithOrganization extends Attendance {
  organization: Organization;
}

export enum AttendanceStatus {
  CLOCKED_IN = "clocked_in",
  PENDING = "pending",
  CLOCKED_OUT = "clocked_out",
  APPROVED = "approved",
  REJECTED = "rejected",
}
