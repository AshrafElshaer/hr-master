import { getUser } from "../../queries/user";
import type { EventInsert, EventUpdate, SupabaseClient } from "../../types";
import { format } from "date-fns";

export async function createEvent(
  supabase: SupabaseClient,
  event: EventInsert,
) {
  const { user } = await getUser(supabase);
  if (!user || !user.id || !user.organization_id) {
    throw new Error("User not found");
  }
  const newEvent: EventInsert = {
    ...event,
    event_date: format(new Date(event.event_date), "yyyy-MM-dd"),
    organization_id: user.organization_id,
    organizer_id: user.id,
  };

  return await supabase.from("events").insert([newEvent]).select().single();
}

export async function updateEvent(
  supabase: SupabaseClient,
  event: EventUpdate,
) {
  return await supabase
    .from("events")
    .update(event)
    .eq("id", event.id as string)
    .select();
}
