import { getUser } from "../../queries/user";
import type { EventInsert, SupabaseClient } from "../../types";

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
    organization_id: user.organization_id,
    organizer_id: user.id,
  };
  return await supabase.from("events").insert([newEvent]).select().single();
}
