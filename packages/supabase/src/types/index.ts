import type { SupabaseClient as ClientType } from "@supabase/supabase-js";
import type { Database } from "./db";

export type SupabaseClient = ClientType<Database>;

export * from "./db";
