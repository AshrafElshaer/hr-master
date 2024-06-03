import type { SupabaseClient, UserWithDepartment } from "../../types";
import { unstable_cache } from "next/cache";
export async function getUser(supabase: SupabaseClient) {
  const {
    data: { user:userAuth },
    error,
  } = await supabase.auth.getUser();
  if (error || !userAuth) {
    return { error, user: null };
  }
  const { data: user } = await supabase
    .from("users")
    .select()
    .eq(
      "id",
      userAuth.id,
    )
    .single();

  return { user, error };
}

export const getEmployees = unstable_cache(
  async (supabase: SupabaseClient) => {
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
  },
  ["employees"],
  {
    tags: ["employees"],
  },
);

export async function getEmployeeById(
  supabase: SupabaseClient,
  employeeId: string,
) {
  const { data, error } = await supabase.from("users")
    .select(
      "* , department:department_id(*,person_in_charge:person_in_charge_id(first_name,last_name))",
    )
    .eq(
      "id",
      employeeId,
    )
    .single()
    .throwOnError();

  if (error) {
    throw error;
  }

  return data as unknown as UserWithDepartment;
}
