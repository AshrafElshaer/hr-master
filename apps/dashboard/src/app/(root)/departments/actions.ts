"use server";
import { z } from "zod";
import { action } from "@/lib/safe-action";
import { createServerClient } from "@hr-toolkit/supabase/server";

import { createDepartment } from "@hr-toolkit/supabase/departments-mutaions";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { departmentSchema } from "./validation";

export const createNewDepartment = action(
  departmentSchema,
  async (department) => {
    const supabase = createServerClient();
    const {user} = await getUser(supabase);
    if (!user) {
      throw new Error("User not found");
    }

    // const { data: newDepartment, error } = await createDepartment(supabase, {
    //   name: department.departmentName,
    //   description: department.departmentDescription,
    //   organization_id: user.organization_id,
    // });

    // if (error) {
    //   throw error;
    // }

    // return newDepartment;
    return null;
  },
);
