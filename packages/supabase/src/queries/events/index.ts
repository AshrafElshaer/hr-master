import type { SupabaseClient } from "../../types";
import { addDays, endOfDay, format } from "date-fns";

export async function getEventsByDate(supabase: SupabaseClient, date: {
  from: Date | undefined;
  to: Date | undefined;
}) {
  if (!date.from) {
    return {
      data: [],
      error: "Invalid date",
    };
  }
  const from = format(date.from, "yyyy-MM-dd");
  const to = date.to
    ? format(endOfDay(date.to), "yyy-MM-dd")
    : format(endOfDay(addDays(date.from, 7)), "yyyy-MM-dd");

  return await supabase
    .from("events")
    .select("*, organizer:organizer_id(*),department:department_id(*)")
    .gte("event_date", from)
    .lte(
      "event_date",
      to,
    );
}
