import { getUser } from "../../queries/user";
import type { Database, SupabaseClient } from "../../types";

type PersonalInfo = Database["public"]["Tables"]["users"]["Update"];

export async function updateUserInfo(
  supabase: SupabaseClient,
  data: PersonalInfo,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Session not found");
  }

  return await supabase.from("users").update(data).eq("id", userId).select()
    .single().throwOnError();
}
