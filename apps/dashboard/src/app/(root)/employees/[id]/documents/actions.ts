"use server";

import { DEFAULT_STORAGE_FOLDERS } from "@/constants/default-storage-files";

import { createServerClient } from "@hr-toolkit/supabase/server";
import { getEmployeeById } from "@hr-toolkit/supabase/user-queries";

export const getEmployeeFolders = async (
  employeeId: string,
  folder: string,
) => {
  const supabase = createServerClient();
  const employee = await getEmployeeById(supabase, employeeId);
  const { data, error } = await supabase.storage
    .from("employee-documents")
    .list(`${employee.organization_id}/${employeeId}/${folder}`, {
      sortBy:{
        column: 'name',
        order: 'desc'
      
      },
    })

  if (error) {
    throw error;
  }

  return data;
};
