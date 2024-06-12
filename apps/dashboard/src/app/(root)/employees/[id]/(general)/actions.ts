"use server";
import { action } from "@/lib/safe-action";
import { createServerClient } from "@hr-toolkit/supabase/server";
import { updateEmployeeById } from "@hr-toolkit/supabase/user-mutations";
import { revalidatePath } from "next/cache";

export async function uploadProfileImg(
  formData: FormData,
) {
  const supabase = createServerClient();
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
  const organizationId = formData.get("organizationId") as string;
  const imgPath = `${organizationId}/${userId}`;

  await supabase.storage.from("avatars").remove([imgPath]);

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(imgPath, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    throw error;
  }

  const { data: urlResponse } = await supabase.storage.from("avatars")
    .createSignedUrl(data.path, 60 * 60 * 24 * 365); // 365 days

  const updated = await updateEmployeeById(supabase, {
    id: userId,
    avatar_url: urlResponse?.signedUrl,
  });
  revalidatePath(`/employees/${userId}`);
  return updated;
}
