import { getUser } from "../../queries/user";
import type { Database, SupabaseClient } from "../../types";

type CreateOrganization =
  Database["public"]["Tables"]["organizations"]["Insert"];

export async function createOrganization(
  supabase: SupabaseClient,
  data: CreateOrganization,
) {
  const { user } = await getUser(supabase);
  if (!user) {
    throw new Error("User not found");
  }
  const { error: orgError, data: organization } = await supabase.from(
    "organizations",
  )
    .insert([{
      ...data,
      owner_id: user.id,
    }])
    .select()
    .single()
    .throwOnError();

  if (orgError) {
    throw new Error(`Failed to create organization: ${orgError.message}`);
  }

  return { success: true };
}
