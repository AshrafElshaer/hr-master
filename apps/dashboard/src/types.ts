import type { GenerateLinkProperties, User } from "@supabase/supabase-js";
import type React from "react";

export type ReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;
export type EmailOtpConfirmation = {
  properties: GenerateLinkProperties;
  user: User;
} | {
  properties: null;
  user: null;
};
