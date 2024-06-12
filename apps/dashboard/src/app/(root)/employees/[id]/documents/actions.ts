"use server";

import { action } from "@/lib/safe-action";

import { createServerClient } from "@hr-toolkit/supabase/server";
import {
  createStorageFolder,
  deleteStorageFolder,
  renameStorageFolder,
} from "@hr-toolkit/supabase/storage-mutations";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";
import { z } from "zod";

const newFolderSchema = z.object({
  employeeId: z.string(),
  folderName: z.string(),
  folderPath: z.string(),
});

export const createFolder = action(newFolderSchema, async (input) => {
  const supabase = createServerClient();
  const newFolder = await createStorageFolder(supabase, input);

  return newFolder;
});

const renameFolderSchema = z.object({
  employeeId: z.string(),
  folderPath: z.string(),
  folderName: z.string(),
  newFolderName: z.string(),
});

export const renameFolder = action(
  renameFolderSchema,
  async (input) => {
    const supabase = createServerClient();
    const newFolder = await renameStorageFolder(supabase, input);

    return newFolder;
  },
);

export const deleteFolder = action(
  newFolderSchema,
  async ({ employeeId, folderPath, folderName }) => {
    const supabase = createServerClient();
    const isDeleted = await deleteStorageFolder(supabase, {
      employeeId,
      folderPath,
      folderName,
    });

    return isDeleted;
  },
);

export async function uploadFile(
  formData: FormData,
) {
  const supabase = createServerClient();
  const file = formData.get("file") as File;
  const employeeId = formData.get("employeeId") as string;
  const folderPath = formData.get("folderPath") as string;

  const employee = await getEmployeeById(supabase, employeeId);
  const directoryPath = [
    employee.organization_id,
    employeeId,
    folderPath,
  ].filter(Boolean).join("/");
  const { data, error } = await supabase.storage
    .from("employee-documents")
    .upload(`${directoryPath}/${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    throw Error(error.message);
  }

  return data;
}
