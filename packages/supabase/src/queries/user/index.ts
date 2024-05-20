import type { SupabaseClient } from "../../types";

export async function getUser(supabase: SupabaseClient) {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) {
    return { error, user: null };
  }
  const { data: user } = await supabase
    .from("users")
    .select()
    .eq(
      "id",
      session.user.id,
    )
    .single();

  return { user, error };
}
