import React from "react";
import { DataTable } from "./data-table";
import { type DepartmentColumn, columns } from "./columns";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getDepartments } from "@hr-toolkit/supabase/departments-queries";

async function DepartmentTable() {
  const supabase = createServerClient();
  const departments = await getDepartments(supabase);

  return (
    <DataTable columns={columns as DepartmentColumn[]} data={departments} />
  );
}

export default DepartmentTable;
