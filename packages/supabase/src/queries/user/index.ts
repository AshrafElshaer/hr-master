import type { SupabaseClient } from "../../types";
import { unstable_cache } from "next/cache";
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

export const getEmployees = unstable_cache(async (supabase: SupabaseClient) => {
  const { user } = await getUser(supabase);
  if (!user || (user.role === "manager" && !user.department_id)) {
    throw new Error("User not found");
  }

  if (user.role === "manager") {
    const { data: employees, error } = await supabase
      .from("users")
      .select("*, department:department_id(*)")
      .eq(
        "department_id",
        user.department_id as string,
      );
    if (error) {
      throw error;
    }
    return employees;
  }

  const { data: employees, error } = await supabase
    .from("users")
    .select("*, department:department_id(*)");

  if (error) {
    throw error;
  }

  return employees;
}, ["employees"], {
  revalidate: 180,
  tags: ["employees"],
});
