import type { AppRouter } from "./server/trpc/routers";
import { createTRPCVue } from "@tnq/client";

export const trpc = createTRPCVue<AppRouter>({
  serverPrefetch: true,
});
