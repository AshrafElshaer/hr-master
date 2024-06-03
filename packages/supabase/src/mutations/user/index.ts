import { getUser } from "../../queries/user";
import type { Database, SupabaseClient, UserWithDepartment } from "../../types";

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

export async function createEmployee(
  supabase: SupabaseClient,
  data: PersonalInfo,
) {
  const { user: currentUser } = await getUser(supabase);
  if (!currentUser) {
    throw new Error("User not found");
  }
  const { data: { user: newUser }, error } = await supabase.auth.admin
    .createUser({
      email: data.email,
    });

  if (error) {
    throw new Error(error.message);
  }
  if (!newUser) {
    throw new Error("Unable to create user");
  }
  const { data: newUserUpdates, error: updateError } = await supabase.from(
    "users",
  ).update({
    first_name: data.first_name,
    last_name: data.last_name,
    gender: data.gender,
    date_of_birth: data.date_of_birth,
    phone_number: data.phone_number,
    address: data.address,
    city: data.city,
    state: data.state,
    country: data.country,
    zip_code: data.zip_code,
    role: data.role,
    employment_status: data.employment_status,
    department_id: data.department_id,
    position: data.position,
    hire_date: data.hire_date,
    salary: data.salary,
    organization_id: currentUser.organization_id,
    emergency_email: data.emergency_email,
    emergency_name: data.emergency_name,
    emergency_phone_number: data.emergency_phone_number,
    emergency_relation: data.emergency_relation,
  })
    .eq("id", newUser.id)
    .select("* , organization:organization_id(name)")
    .single()
    .throwOnError();
  if (updateError) {
    throw updateError;
  }

  return newUserUpdates;
}

export async function deleteEmployee(supabase: SupabaseClient, {
  employeeId,
}: {
  employeeId: string;
}) {
  return await supabase.auth.admin.deleteUser(employeeId);
}

export async function updateEmployeeById(
  supabase: SupabaseClient,
  data: Partial<PersonalInfo>,
) {
  const { data: updated, error } = await supabase.from("users").update(data).eq(
    "id",
    data.id as string,
  )
    .select()
    .single().throwOnError();

  if (error) {
    throw error;
  }
  return updated;
}
