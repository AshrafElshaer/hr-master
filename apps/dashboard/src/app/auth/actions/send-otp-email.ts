"use server";

import { OtpEmail } from "@hr-toolkit/emails";
import { resend } from "@/lib/resend";
import { z } from "zod";
import { action } from "@/lib/safe-action";
import { createServerClient } from "@hr-toolkit/supabase/server";

const otpEmailSchema = z.object({
  email: z.string().email(),
});

async function generateOtpCode({
  email,
}: {
  email: string;
}) {
  const supabase = createServerClient({
    isAdmin: true,
  });
  return await supabase.auth.admin.generateLink(
    {
      email: email,
      type: "magiclink",
    },
  );
}

export const sendOtpEmail = action(
  otpEmailSchema,
  async ({ email }) => {
    const { data: otpResponse, error: otpError } = await generateOtpCode({
      email,
    });
    if (otpError || !otpResponse?.properties?.email_otp) {
      throw new Error(otpError?.message || "Failed to generate OTP code");
    }

    const { data: emailResponase, error: emailError } = await resend.emails
      .send({
        from: "HR Toolkit <onboarding@fxresearch.app>",
        to: [email],
        subject: "HR Toolkit OTP Access",
        react: OtpEmail({
          otpCode: otpResponse.properties.email_otp,
        }),
      });

    if (emailError || !emailResponase?.id) {
      throw new Error(emailError?.message || "Failed to send OTP email");
    }

    return otpResponse;
  },
);
