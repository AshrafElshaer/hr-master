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
  dateOfBirth: string;
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
}: PersonalInfo) {
  return await supabase.auth.updateUser({
    data: {
      firstName,
      lastName,
      address,
      city,
      state,
      country,
      zipCode,
      dateOfBirth,
    },
    phone: phoneNumber,
  });
}
