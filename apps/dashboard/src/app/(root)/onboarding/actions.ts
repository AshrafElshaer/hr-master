"use server";
import { action } from "@/lib/safe-action";
import { personalInfoSchema } from "./validations";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { updateUserInfo } from "@hr-toolkit/supabase/user-mutations";
import { createOrganization } from "../../../../../packages/supabase/src/mutations/organization";
import { organizationFormSchema } from "./validations";
import { getUser } from "@hr-toolkit/supabase/user-queries";

export const onboardingPersonal = action(personalInfoSchema, async (data) => {
  const supabase = createServerClient();

  const { error, data: updated } = await updateUserInfo(supabase, {
    first_name: data.firstName,
    last_name: data.lastName,
    address: data.address,
    city: data.city,
    state: data.state,
    zip_code: data.zipCode,
    country: data.country,
    phone_number: data.phoneNumber,
    date_of_birth: data.dateOfBirth.toString(),
    role: "owner",
    updated_at: new Date().toISOString(),
  });
  if (error) {
    throw new Error(error.message);
  }
  return updated;
});

export const onboardingOrganization = action(
  organizationFormSchema,
  async (data) => {
    const supabase = createServerClient();

    const { success } = await createOrganization(supabase, {
      name: data.organizationName,
      type: data.organizationType,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      zip_code: data.zipCode,
      employees_count: data.employeesCount,
      contact_name: data.contactName,
      contact_email: data.contactEmail,
      contact_number: data.contactNumber,
    });

    return { success };
  },
);
