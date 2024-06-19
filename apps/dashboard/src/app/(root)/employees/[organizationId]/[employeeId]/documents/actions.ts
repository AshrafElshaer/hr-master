"use server";

import { action } from "@/lib/safe-action";

import { createServerClient } from "@hr-toolkit/supabase/server";
import {
  createStorageFolder,
  deleteStorageFolder,
  renameStorageFolder,
} from "@hr-toolkit/supabase/storage-mutations";

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

  return newFolder;
});

const renameFolderSchema = newFolderSchema.extend({
  newFolderName: z.string(),
});

export const renameFolder = action(renameFolderSchema, async (input) => {
  const supabase = createServerClient();
  const renamed = await renameStorageFolder(supabase, input);

  return renamed;
});

export const deleteFolder = action(newFolderSchema, async (input) => {
  const supabase = createServerClient();
  const isDeleted = await deleteStorageFolder(supabase, input);

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

// /employees/daebb6bb-b1ce-4b91-a867-d06e423b412e/9b64a013-b071-451a-8f15-8d0daf5f681a/documents/
// /employees/daebb6bb-b1ce-4b91-a867-d06e423b412e/9b64a013-b071-451a-8f15-8d0daf5f681a/documents
