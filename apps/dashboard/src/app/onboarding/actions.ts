"use server";
import { action } from "@/lib/safe-action";
import { personalInfoSchema } from "./validations";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { updateUserInfo } from "@hr-toolkit/supabase/user-mutaions";
import { createOrganization } from "@hr-toolkit/supabase/organization-mutaions";
import { organizationFormSchema } from "./validations";
import { getUser } from "@hr-toolkit/supabase/user-queries";

export const onboardingPersonal = action(
  personalInfoSchema,
  async (data) => {
    const supabase = createServerClient({
      isAdmin: true,
    });
    const user = await getUser(supabase);

    if (!user) {
      throw new Error("User not found");
    }

    const { error } = await updateUserInfo(supabase, {
      ...data,
      role: "owner",
      userId: user.id,
    });
    if (error) {
      throw new Error(error.message);
    }
  },
);

export const onboardingOrganization = action(
  organizationFormSchema,
  async (data) => {
    const supabase = createServerClient();
    const { organization, orgError, userError } = await createOrganization(
      supabase,
      data,
    );

    if (orgError) {
      throw new Error(orgError);
    }

    if (userError) {
      throw new Error(userError);
    }

    return organization;
  },
);
