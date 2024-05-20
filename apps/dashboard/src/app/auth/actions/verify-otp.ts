"use server";
import { action } from "@/lib/safe-action";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { getUser } from "@hr-toolkit/supabase/user-queries";
import { redirect } from "next/navigation";
import { z } from "zod";

const otpCodeSchema = z.object({
  email: z.string().email(),
  otpCode: z.string(),
});

export const verifyOtp = action(
  otpCodeSchema,
  async ({ otpCode, email }) => {
    const supabase = createServerClient();

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otpCode,
      type: "magiclink",
    });
    if (error) {
      throw new Error(error.message);
    }
    const { user } = await getUser(supabase);
    const organizationId = user?.organization_id;
    if (!organizationId) {
      redirect("/onboarding");
    }
    if (data.session && user) {
      redirect("/");
    }
  },
);
