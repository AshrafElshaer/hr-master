import { AttendanceStatus, type SupabaseClient } from "../../types";
import { getUser } from "../../queries/user";
import { getCurrentAttendanceByUserId } from "../../queries/attendance";

export async function clockIn(supabase: SupabaseClient) {
  const { user } = await getUser(supabase);

  if (!user || !user.id || !user.organization_id) {
    throw new Error("User not found");
  }

  const { data, error } = await supabase.from("attendance").insert(
    [
      {
        user_id: user.id,
        organization_id: user.organization_id,
        clock_in: new Date().toString(),
        status: "clocked_in",
        created_at: new Date().toString(),
      },
    ],
  ).select("*").single();

  if (error) {
    throw Error(error.message);
  }

  return data;
}

export async function clockOut(supabase: SupabaseClient) {
  const now = new Date().toString();
  const { user } = await getUser(supabase);

  if (!user || !user.id) {
    throw new Error("User not found");
  }

  const currentAttendance = await getCurrentAttendanceByUserId(
    supabase,
    user.id,
  );

  if (!currentAttendance) {
    throw new Error("No attendance found");
  }

  const totalTime = getTotalWorkedTime(
    currentAttendance.clock_in,
    now,
  );

  const { data, error } = await supabase
    .from("attendance")
    .update({
      clock_out: now,
      status: AttendanceStatus.PENDING,
      updated_at: now,
    })
    .eq("user_id", user.id)
    .eq("status", "clocked_in")
    .select("*")
    .single();

  if (error) {
    throw Error(error.message);
  }

  return data;
}

function getTotalWorkedTime(clockIn: string, clockOut: string) {
  const diff = new Date(clockOut).getTime() - new Date(clockIn).getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);

  return hours * 60 + minutes; // return in minutes
}
