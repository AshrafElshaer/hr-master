"use server";
import { action } from "@/lib/safe-action";
import { createServerClient } from "@hr-toolkit/supabase/server";

import { getUser } from "@hr-toolkit/supabase/user-queries";
import { getCurrentAttendanceByUserId } from "@hr-toolkit/supabase/attendance-queries";
import { clockIn, clockOut } from "@hr-toolkit/supabase/attendance-mutations";

import { z } from "zod";
import { revalidatePath } from "next/cache";

export const getCurrentAttendance = action(z.null(), async () => {
  const supabase = createServerClient(/* add your server code here */);
  const { user } = await getUser(supabase);
  if (!user || !user.id) {
    throw new Error("User not found");
  }
  return await getCurrentAttendanceByUserId(supabase, user.id);
});

export const clockInAction = action(z.null(), async () => {
  const supabase = createServerClient();

  const attendance = await clockIn(supabase);
  revalidatePath("/");

  return attendance;
});

export const clockOutAction = action(z.null(), async () => {
    const supabase = createServerClient();
    
    const attendance = await clockOut(supabase);
    revalidatePath("/");
    
    return attendance;
});
