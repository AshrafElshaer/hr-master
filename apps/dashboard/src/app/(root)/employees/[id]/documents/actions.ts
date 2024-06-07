"use server";

import { DEFAULT_STORAGE_FOLDERS } from "@/constants/default-storage-files";
import { action } from "@/lib/safe-action";

import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";
import { createStorageFolder } from "@hr-toolkit/supabase/storage-mutations";
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
