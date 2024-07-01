"use server";
import { action } from "@/lib/safe-action";
import { createServerClient } from "@hr-toolkit/supabase/server";

import { getUser } from "@hr-toolkit/supabase/user-queries";
import { getCurrentAttendanceByUserId } from "@hr-toolkit/supabase/attendance-queries";
import { clockIn, clockOut } from "@hr-toolkit/supabase/attendance-mutations";
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from "@hr-toolkit/supabase/events-mutations";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createEventSchema } from "./validations";

export const getCurrentAttendance = action(z.null(), async () => {
  const supabase = createServerClient(/* add your server code here */);
  const { user } = await getUser(supabase);
  if (!user || !user.id) {
    throw new Error("User not found");
  }
  return await getCurrentAttendanceByUserId(supabase, user.id);
});

export const clockInAction = action(
  z.object({
    clockedInAt: z.string(),
  }),
  async ({ clockedInAt }) => {
    const supabase = createServerClient();

    const attendance = await clockIn(supabase, clockedInAt);
    revalidatePath("/");

    return attendance;
  },
);

export const clockOutAction = action(
  z.object({
    clockedOutAt: z.string(),
  }),
  async ({ clockedOutAt }) => {
    const supabase = createServerClient();

    const attendance = await clockOut(supabase, clockedOutAt);
    revalidatePath("/");

    return attendance;
  },
);

export const createEventAction = action(
  createEventSchema,
  async (payload) => {
    const supabase = createServerClient();

    const { data, error } = await createEvent(supabase, payload);

    if (error) {
      throw new Error(error.message);
    }
    revalidatePath("/");
    return data;
  },
);

export const updateEventAction = action(
  createEventSchema.extend({
    id: z.string().min(1),
  }),
  async (payload) => {
    const supabase = createServerClient();

    const { data, error } = await updateEvent(supabase, payload);

    if (error) {
      throw Error(error.message);
    }
    revalidatePath("/");
    return data;
  },
);

export const deleteEventAction = action(
  z.string().min(1),
  async (id) => {
    const supabase = createServerClient();

    const { error } = await deleteEvent(supabase, id);

    if (error) {
      throw Error(error.message);
    }
    revalidatePath("/");
  },
);
