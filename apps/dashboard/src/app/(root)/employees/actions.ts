"use server";
import { action } from "@/lib/safe-action";
import { employeeSchema } from "./validation";
import { createEmployee } from "@hr-toolkit/supabase/user-mutaions";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { resend } from "@/lib/resend";
import { NewEmployeeEmail } from "@hr-toolkit/emails";

import type { UserWithOrdanization } from "@hr-toolkit/supabase/types";

export const createNeweEmployee = action(employeeSchema, async (data) => {
  const supabase = createServerClient({
    isAdmin: true,
  });

  const { user } = await getUser(supabase);
  if (!user) {
    throw new Error("User not found");
  }

  const newEmployee = await createEmployee(supabase, {
    ...data,
    hire_date: data.hire_date.toString(),
    date_of_birth: data.date_of_birth.toString(),
    organization_id: user.organization_id,
  }) as unknown as UserWithOrdanization;

  const { error: emailError } = await resend.emails.send({
    from: "HR Toolkit <support@fxresearch.app>",
    to: newEmployee.email,
    subject: "Welcome to HR Toolkit",
    react: NewEmployeeEmail({
      name: `${newEmployee.first_name} ${newEmployee.last_name}` as string,
      organizationName: newEmployee.organization.name,
    }),
  });

  if (emailError) {
    throw emailError;
  }

  return newEmployee;
});
