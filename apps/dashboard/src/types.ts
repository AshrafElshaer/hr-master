import type { Database } from "@hr-toolkit/supabase/types";
import type {
  GenerateLinkProperties,
  User as AuthUser,
} from "@supabase/supabase-js";
import type React from "react";

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type EmailOtpConfirmation =
  | {
      properties: GenerateLinkProperties;
      user: AuthUser;
    }
  | {
      properties: null;
      user: null;
    };
