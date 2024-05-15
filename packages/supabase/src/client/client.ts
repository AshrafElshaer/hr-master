import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../types";
import { env } from "@hr-toolkit/env";

export const createClient = (
  isAdmin = false,
) =>
  createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    isAdmin
      ? env.NEXT_PUBLIC_SUPABASR_SERVICE_ROLE_KEY
      : env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
