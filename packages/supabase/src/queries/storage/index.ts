import { createServerClient } from "../../client/server";
import type { SupabaseClient } from "../../types";
import { getEmployeeById, getUser } from "../user";

export const getEmployeeFolders = async (
  supabase: SupabaseClient,
  employeeId: string,
  folder: string,
) => {
  const employee = await getEmployeeById(supabase, employeeId);

  const { data, error } = await supabase.storage
    .from("employee-documents")
    .list(`${employee.organization_id}/${employeeId}/${folder}`, {});

  if (error) {
    throw error;
  }

  return data;
};

export const getSignedUrl = async (supabase: SupabaseClient, {
  filePath,
  expiresIn,
}: {
  filePath: string;
  expiresIn: number;
}) => {
  const { data, error } = await supabase.storage
    .from("employee-documents")
    .createSignedUrl(
      filePath,
      expiresIn,
    );
  if (error) {
    console.error("Error downloading file", error.message);
    throw Error(error.message);
  }
  return data;
};
