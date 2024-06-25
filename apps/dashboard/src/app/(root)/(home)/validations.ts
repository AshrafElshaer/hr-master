import { z } from "zod";

export const createEventSchema = z.object({
  event_name: z.string().min(3),
  event_description: z.string().min(10).max(100),
  event_type: z.enum(["meeting", "conference", "birthday", "anniversary"]),
  event_date: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  location: z.string().min(3),
  organizer_id: z.string().default(""),
  organization_id: z.string().default(""),
  department_id: z.nullable(
    z.string().min(1),
  ),
});
