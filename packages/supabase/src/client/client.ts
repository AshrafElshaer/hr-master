import { createBrowserClient } from "@supabase/ssr";
import { env } from "@hr-toolkit/env";
import type { Database } from "../types";
import type { SupabaseClientOptions } from "./server";

export const createClient = (options: SupabaseClientOptions = {
  isAdmin: false,
}) =>
  createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    options.isAdmin
      ? env.NEXT_PUBLIC_SUPABASR_SERVICE_ROLE_KEY
      : env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
