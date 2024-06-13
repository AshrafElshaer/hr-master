"use server";
import { z } from "zod";
import { action } from "@/lib/safe-action";
import { createServerClient } from "@hr-toolkit/supabase/server";

import {
  createDepartment,
  deleteOrganizationDepartment,
  updateDepartment,
} from "@hr-toolkit/supabase/departments-mutations";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { departmentSchema } from "./validation";

export const createNewDepartment = action(
  departmentSchema,
  async (newDepartment) => {
    const supabase = createServerClient();
    const { user } = await getUser(supabase);
    if (!user || !user.organization_id) {
      throw new Error("User not found");
    }

    const { data: departmentCreated, error } = await createDepartment(
      supabase,
      {
        name: newDepartment.departmentName,
        description: newDepartment.departmentDescription,
        person_in_charge_id: newDepartment.personInCharge,
        organization_id: user.organization_id,
      },
    );

    if (error) {
      throw error;
    }

    return departmentCreated;
  },
);

export const editDepartment = action(departmentSchema, async (data) => {
  const supabase = createServerClient();

  const { data: departmentUpdated, error } = await updateDepartment(supabase, {
    id: data.id,
    name: data.departmentName,
    description: data.departmentDescription,
    person_in_charge_id: data.personInCharge,
  });

  if (error) {
    throw error;
  }

  return departmentUpdated;
});

export const deleteDepartment = action(
  z.object({
    id: z.string(),
  }),
  async (data) => {
    const supabase = createServerClient();

    const { data: departmentDeleted, error } =
      await deleteOrganizationDepartment(supabase, data.id);

    if (error) {
      throw error;
    }

    return departmentDeleted;
  },
);
