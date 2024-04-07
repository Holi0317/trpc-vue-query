import type { AppRouter } from "./server/trpc/routers";
import { createTRPCVue } from "@tvq/client";

export const trpc = createTRPCVue<AppRouter>({
  serverPrefetch: true,
});
