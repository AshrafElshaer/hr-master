"use server";
import { action } from "@/lib/safe-action";
import { personalInfoSchema } from "./components/onboarding-form";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { updateUserInfo } from "@hr-toolkit/supabase/user-mutaions";

// export const onboardingPersonal = action(
//   personalInfoSchema,
//   async (data) => {
//     const supabase = createServerClient();
//     const { error } = await updateUserInfo(supabase, data);
//     if (error) {
//       throw new Error(error.message);
//     }
//   },
// );
