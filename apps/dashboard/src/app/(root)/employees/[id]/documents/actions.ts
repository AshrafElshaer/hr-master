"use server";

import { action } from "@/lib/safe-action";

import { createServerClient } from "@hr-toolkit/supabase/server";
import {
  createStorageFolder,
  deleteStorageFolder,
  renameStorageFolder,
} from "@hr-toolkit/supabase/storage-mutations";
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
