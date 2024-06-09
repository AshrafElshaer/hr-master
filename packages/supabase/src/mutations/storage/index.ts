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
export async function renameStorageFolder(
  supabase: SupabaseClient,
  { employeeId, folderPath, folderName, newFolderName }: {
    employeeId: string;
    folderPath: string;
    folderName: string;
    newFolderName: string;
  },
) {
  const employee = await getEmployeeById(supabase, employeeId);
  const rootDirectory = [employee.organization_id, employeeId].join("/");

  const directoryPath = folderPath
    ? [rootDirectory, folderPath, folderName].join("/")
    : [rootDirectory, folderName].join("/");

  const filesPaths = await getSubFilesPaths(
    supabase,
    directoryPath,
  );

  const newFilePathsObject: Record<string, string> = filesPaths.reduce(
    (acc, filePath) => {
      const key = filePath;
      const value = filePath.replace(folderName, newFolderName);

      return Object.assign({}, acc, { [key]: value });
    },
    {},
  );

  for (const [oldPath, newPath] of Object.entries(newFilePathsObject)) {
    const { error } = await supabase.storage.from("employee-documents")
      .move(oldPath, newPath);

    if (error) {
      throw Error(error.message);
    }
  }

  return true;
}

export async function deleteStorageFolder(supabase: SupabaseClient, {
  employeeId,
  folderPath,
  folderName,
}: {
  employeeId: string;
  folderPath: string;
  folderName: string;
}) {
  const employee = await getEmployeeById(supabase, employeeId);
  const rootDirectory = [employee.organization_id, employeeId].join("/");
  const directoryPath = folderPath
    ? [rootDirectory, folderPath, folderName].join("/")
    : [rootDirectory, folderName].join("/");
  const filesPaths = await getSubFilesPaths(supabase, directoryPath);

  const { error } = await supabase.storage.from("employee-documents").remove(
    filesPaths,
  );
  if (error) {
    throw Error(error.message);
  }

  return true;
}

async function getSubFilesPaths(
  supabase: SupabaseClient,
  directoryPath: string,
): Promise<string[]> {
  const { data, error } = await supabase.storage.from("employee-documents")
    .list(directoryPath);

  if (error) {
    throw Error(error.message);
  }

  const files: string[] = [];

  for (const file of data) {
    if (!file.metadata) {
      const subFolder: string[] = await getSubFilesPaths(
        supabase,
        `${directoryPath}/${file.name}`,
      );

      files.push(...subFolder);
    } else {
      files.push(`${directoryPath}/${file.name}`);
    }
  }

  return files;
}
