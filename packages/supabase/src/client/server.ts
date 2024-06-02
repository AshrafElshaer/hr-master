import { createServerClient as _createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@hr-toolkit/env";
import type { Database } from "../types";

export type SupabaseClientOptions = {
  isAdmin: boolean;
};

export const createFetch =
  (options: Pick<RequestInit, "next" | "cache">) =>
  (url: RequestInfo | URL, init?: RequestInit) => {
    return fetch(url, {
      ...init,
      ...options,
    });
  };

export function createServerClient(options: SupabaseClientOptions = {
  isAdmin: false,
}) {
  const cookieStore = cookies();

  // Create a server's supabase client with newly configured cookie,
  // which could be used to maintain user's session
  return _createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    options.isAdmin
      ? env.NEXT_PUBLIC_SUPABASR_SERVICE_ROLE_KEY
      : env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        fetch: createFetch({
          cache: "force-cache",
        }),
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
