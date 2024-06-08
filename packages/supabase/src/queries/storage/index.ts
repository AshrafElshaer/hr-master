"use server";
import { createServerClient } from "../../client/server";
import { getEmployeeById } from "../user";

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