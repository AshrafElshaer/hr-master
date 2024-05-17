import { getUser } from "../../queries/user";
import type { Database, SupabaseClient } from "../../types";

type CreateOrganization = {
  organizationName: string;
  organizationType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  employeesCount: number;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
};
export async function createOrganization(
  supabase: SupabaseClient,
  data: CreateOrganization,
) {
  const user = await getUser(supabase);
  if (!user) {
    throw new Error("User not found");
  }
  const { data: organization, error: orgError } = await supabase.from(
    "organizations",
  )
    .insert({
      organization_name: data.organizationName,
      organization_type: data.organizationType,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      zip_code: data.zipCode,
      employees_count: data.employeesCount,
      contact_name: data.contactName,
      contact_email: data.contactEmail,
      contact_number: data.contactNumber,
      owner_id: user.id,
    }).select().single();

  if (orgError) {
    throw new Error(orgError.message);
  }

  const { error: userError } = await supabase.auth.updateUser({
    data: { organization_id: organization.id },
  });

  if (userError) {
    throw new Error(userError.message);
  }

  return { organization, userError, orgError };
}
