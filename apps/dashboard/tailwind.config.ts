// tailwind config is required for editor support

import type { Config } from "tailwindcss";
import sharedConfig from "@hr-toolkit/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],

  presets: [sharedConfig],
};

export default config;
