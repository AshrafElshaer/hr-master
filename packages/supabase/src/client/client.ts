import { createBrowserClient } from "@supabase/ssr";
// import type { Database } from "../types";
import { env } from "@hr-toolkit/env";

export const createClient = () =>
  createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
