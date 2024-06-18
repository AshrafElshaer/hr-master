"use server";

import { action } from "@/lib/safe-action";

import { createServerClient } from "@hr-toolkit/supabase/server";
import {
  createStorageFolder,
  deleteStorageFolder,
  renameStorageFolder,
} from "@hr-toolkit/supabase/storage-mutations";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const newFolderSchema = z.object({
  organizationId: z.string(),
  employeeId: z.string(),
  folderName: z.string(),
  folderPath: z.string(),
});

export const createFolder = action(newFolderSchema, async (input) => {
  const supabase = createServerClient();
  const newFolder = await createStorageFolder(supabase, input);

  revalidatePath(`employees/${input.employeeId}/documents/${input.folderPath}`);

  return newFolder;
});

const renameFolderSchema = z.object({
  organizationId: z.string(),
  employeeId: z.string(),
  folderPath: z.string(),
  folderName: z.string(),
  newFolderName: z.string(),
});

export const renameFolder = action(renameFolderSchema, async (input) => {
  const supabase = createServerClient();
  const newFolder = await renameStorageFolder(supabase, input);
  revalidatePath(
    `employees/${input.organizationId}/${input.employeeId}/documents/${input.folderPath}`,
  );

  return newFolder;
});

export const deleteFolder = action(newFolderSchema, async (input) => {
  const supabase = createServerClient();
  const isDeleted = await deleteStorageFolder(supabase, input);

  revalidatePath(`employees/${input.organizationId}/${input.employeeId}/documents/${input.folderPath}`);

  return isDeleted;
});

export async function uploadFile(formData: FormData) {
  const supabase = createServerClient();
  const file = formData.get("file") as File;
  const organizationId = formData.get("organizationId") as string;
  const employeeId = formData.get("employeeId") as string;
  const folderPath = formData.get("folderPath") as string;

  const directoryPath = [organizationId, employeeId, folderPath]
    .filter(Boolean)
    .join("/");
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
