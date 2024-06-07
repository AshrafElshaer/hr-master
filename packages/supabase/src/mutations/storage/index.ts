import { createServerClient } from "../../client/server";
import { getEmployeeById } from "../../queries/user";
import type { SupabaseClient } from "../../types";

export const EMPTY_FOLDER_PLACEHOLDER_FILE_NAME = ".emptyFolderPlaceholder";

export async function createStorageFolder(
  supabase: SupabaseClient,
  { employeeId, folderName, folderPath }: {
    employeeId: string;
    folderName: string;
    folderPath: string;
  },
) {
  const employee = await getEmployeeById(supabase, employeeId);
  // console.log({
  //   fol
  // })
  const fullPath = decodeURIComponent(
    [
      employee.organization_id,
      employeeId,
      folderPath,
      folderName,
      EMPTY_FOLDER_PLACEHOLDER_FILE_NAME,
    ].join("/"),
  );
  const { data, error } = await supabase.storage.from("employee-documents")
    .upload(
      fullPath,
      new File([], EMPTY_FOLDER_PLACEHOLDER_FILE_NAME),
    );

  if (error) {
    throw Error(error.message);
  }

  return data;
}
