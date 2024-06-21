import { AttendanceStatus, type SupabaseClient } from "../../types";

export async function getCurrentAttendanceByUserId(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .eq("status", AttendanceStatus.CLOCKED_IN)
    .single();

  if (error) {
    throw Error(error.message);
  }

  return data;
}
