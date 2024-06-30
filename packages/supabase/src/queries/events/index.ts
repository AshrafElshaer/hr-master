import type { SupabaseClient } from "../../types";

export async function getEventsByDate(supabase: SupabaseClient, date: {
  from: string;
  to: string;
}) {
  if (!date.from) {
    return {
      data: [],
      error: "Invalid date",
    };
  }

  return await supabase
    .from("events")
    .select("*, organizer:organizer_id(*),department:department_id(*)")
    .gte("event_date", date.from)
    .lte(
      "event_date",
      date.to,
    );
}
