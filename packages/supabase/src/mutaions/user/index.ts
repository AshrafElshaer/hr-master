import type { SupabaseClient } from "../../types";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  dateOfBirth: Date;
  role?: "owner" | "manager" | "employee";
  userId: string;
}

export async function updateUserInfo(supabase: SupabaseClient, {
  firstName,
  lastName,
  address,
  city,
  state,
  country,
  zipCode,
  phoneNumber,
  dateOfBirth,
  role,
  userId,
}: PersonalInfo) {
  return await supabase.auth.admin.updateUserById(
    userId,
    {
      user_metadata: {
        firstName,
        lastName,
        address,
        city,
        state,
        country,
        zipCode,
        phoneNumber,
        dateOfBirth,
      },
      role,
    },
  );
}
